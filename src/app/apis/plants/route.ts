import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { toDbFormat, fromDbFormat, prepareCardForInsert } from '@/utils/plant'

const TABLE_NAME = 'plants'
const STORAGE_BUCKET = 'plant-images'

// GET /apis/plants - 식물 목록 조회
export async function GET() {
  try {
    const supabase = await createClient()

    // 인증 확인
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 식물 목록 조회
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    const plants = data.map(fromDbFormat)

    return NextResponse.json({ plants })
  } catch (error) {
    console.error('GET /apis/plants error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch plants' },
      { status: 500 }
    )
  }
}

// POST /apis/plants - 식물 등록
export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 인증 확인
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const dataString = formData.get('data') as string
    const parsedData = JSON.parse(dataString)

    // ISO string을 Date 객체로 변환
    const plantData = {
      ...parsedData,
      lastWateredDate: new Date(parsedData.lastWateredDate),
      startDate: new Date(parsedData.startDate),
    }

    // 이미지 업로드 처리
    let coverImageUrl = plantData.image
    if (file) {
      // 파일 업로드
      const fileExt = file.name?.split('.').pop()
      const fileName = `${session.user.id}/${Date.now()}.${fileExt}`

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        })

      if (uploadError) throw uploadError

      // Public URL 가져오기
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uploadData.path)

      coverImageUrl = publicUrl
    }

    // 데이터 준비
    const plantToInsert = prepareCardForInsert(
      { ...plantData, image: coverImageUrl },
      session.user.id
    )
    const dbPlant = toDbFormat(plantToInsert)

    // DB 삽입
    const { data, error } = await supabase.from(TABLE_NAME).insert(dbPlant).select().single()

    if (error) throw error

    const plant = fromDbFormat(data)

    return NextResponse.json(plant)
  } catch (error) {
    console.error('POST /apis/plants error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add plant' },
      { status: 500 }
    )
  }
}

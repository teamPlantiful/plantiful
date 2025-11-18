'use server'

import { createClient } from '@/utils/supabase/server'
import { toDbFormat, fromDbFormat, prepareCardForInsert } from '@/utils/plant'
import { revalidatePath } from 'next/cache'
import type { Plant } from '@/types/plant'

const TABLE_NAME = 'plants'
const STORAGE_BUCKET = 'plant-images'

export default async function addPlantAction(formData: FormData): Promise<Plant> {
  const supabase = await createClient()

  // Middleware가 인증을 보장하므로 user는 항상 존재
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  try {
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`

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
    const plantToInsert = prepareCardForInsert({ ...plantData, image: coverImageUrl }, user.id)
    const dbPlant = toDbFormat(plantToInsert)

    // DB 삽입
    const { data, error } = await supabase.from(TABLE_NAME).insert(dbPlant).select().single()

    if (error) throw error

    const plant = fromDbFormat(data)

    // 캐시 무효화
    revalidatePath('/')

    return plant
  } catch (error) {
    console.error('addPlantAction error:', error)
    throw new Error(error instanceof Error ? error.message : '식물 등록에 실패했습니다.')
  }
}

'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { toDbFormat, fromDbFormat, prepareCardForInsert } from '@/utils/plant'
import { revalidatePath } from 'next/cache'
import type { Plant } from '@/types/plant'
import saveDefaultImage from '@/utils/saveDefaultImage'

const TABLE_NAME = 'plants'
const STORAGE_BUCKET = 'plant-images'

export default async function addPlantAction(formData: FormData): Promise<Plant> {
  const { user, supabase } = await requireAuth()

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

    // 1. 사용자 업로드 이미지 처리
    let coverImageUrl = null
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

    // 2. 농사로 API 기본 이미지를 Storage에 저장
    let defaultImageUrl = plantData.species.imageUrl
    if (defaultImageUrl) {
      const savedUrl = await saveDefaultImage(plantData.species.cntntsNo, defaultImageUrl, supabase)
      defaultImageUrl = savedUrl || defaultImageUrl // 실패 시 원본 URL 사용
    }

    // 3. 데이터 준비
    const plantToInsert = prepareCardForInsert(
      {
        ...plantData,
        species: {
          ...plantData.species,
          imageUrl: defaultImageUrl,
        },
        image: coverImageUrl,
      },
      user.id
    )
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

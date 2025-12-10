'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { revalidatePath } from 'next/cache'

const STORAGE_BUCKET = 'plant-images'

export async function deletePlantAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')

  if (!id) {
    throw new Error('삭제할 식물 정보가 없습니다.')
  }

  const { supabase, user } = await requireAuth()

  // 1. 삭제하기 전에 식물 데이터 조회 (이미지 URL 확인용)
<<<<<<< HEAD
=======
  // .maybeSingle() 사용: 0개 행이 반환되어도 에러 안 남
>>>>>>> 8e5e5e037eb45873d680e60dd4badd48d25d9e13
  const { data: plant, error: fetchError } = await supabase
    .from('plants')
    .select('cover_image_url')
    .eq('id', id)
    .eq('user_id', user.id)
<<<<<<< HEAD
    .single()

  if (fetchError) {
    throw new Error(fetchError.message || '식물 정보를 찾을 수 없습니다.')
=======
    .maybeSingle()

  if (fetchError) {
    throw new Error(fetchError.message || '식물 정보 조회 실패')
>>>>>>> 8e5e5e037eb45873d680e60dd4badd48d25d9e13
  }

  // 2. 사용자가 업로드한 이미지가 있으면 Storage에서 삭제
  if (plant?.cover_image_url && plant.cover_image_url.includes(`/${user.id}/`)) {
    try {
      // Storage URL에서 파일 경로 추출
      const url = new URL(plant.cover_image_url)
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/plant-images\/(.+)/)

      if (pathMatch) {
        const filePath = pathMatch[1]
        const { error: storageError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .remove([filePath])

        if (storageError) {
          console.error('Storage 이미지 삭제 실패:', storageError)
          // Storage 삭제 실패해도 DB는 삭제 진행
        }
      }
    } catch (error) {
      console.error('이미지 URL 파싱 실패:', error)
      // URL 파싱 실패해도 DB는 삭제 진행
    }
  }

  // 3. DB에서 식물 삭제
  const { error } = await supabase.from('plants').delete().eq('id', id).eq('user_id', user.id)

  if (error) {
    throw new Error(error.message || '식물 삭제에 실패했습니다.')
  }

  revalidatePath('/')
}

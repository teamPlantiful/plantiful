import type { SupabaseClient } from '@supabase/supabase-js'

const STORAGE_BUCKET = 'plant-images'
const DEFAULT_IMAGES_FOLDER = 'default-images'

/**
 * 농사로 API 이미지를 Storage에 저장 (중복 방지)
 * - 같은 cntntsNo의 이미지가 이미 존재하면 기존 URL 반환
 * - 없으면 다운로드 후 업로드하여 URL 반환
 *
 * @param cntntsNo - 식물 종류 ID
 * @param imageUrl - 농사로 API 이미지 URL
 * @param supabase - Supabase 클라이언트
 * @returns Storage Public URL 또는 null (실패 시)
 */
export default async function saveDefaultImage(
  cntntsNo: string,
  imageUrl: string,
  supabase: SupabaseClient
): Promise<string | null> {
  try {
    // 1. 파일 확장자 추출
    const urlObj = new URL(imageUrl)
    const pathname = urlObj.pathname
    const ext = pathname.split('.').pop() || 'jpg'
    const fileName = `${DEFAULT_IMAGES_FOLDER}/${cntntsNo}.${ext}`

    // 2. 이미 존재하는지 확인
    const { data: existingFiles } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(DEFAULT_IMAGES_FOLDER, {
        search: `${cntntsNo}.`,
      })

    // 3. 이미 존재하면 기존 URL 반환
    if (existingFiles && existingFiles.length > 0) {
      const existingFileName = `${DEFAULT_IMAGES_FOLDER}/${existingFiles[0].name}`
      const {
        data: { publicUrl },
      } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(existingFileName)
      return publicUrl
    }

    // 4. 이미지 다운로드
    const response = await fetch(imageUrl)
    if (!response.ok) {
      console.error(`이미지 다운로드 실패: ${imageUrl}`)
      return null
    }

    const blob = await response.blob()

    // 5. Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(fileName, blob, {
        cacheControl: '31536000', // 1년 캐시
        upsert: false,
        contentType: blob.type,
      })

    if (uploadError) {
      console.error('이미지 업로드 실패:', uploadError)
      return null
    }

    // 6. Public URL 반환
    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(uploadData.path)

    return publicUrl
  } catch (error) {
    console.error('saveDefaultImage 오류:', error)
    return null
  }
}

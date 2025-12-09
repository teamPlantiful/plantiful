/**
 * Supabase 이미지 URL을 최적화된 transformation URL로 변환
 * @param url 원본 이미지 URL
 * @param width 목표 너비 (px)
 * @param quality 이미지 품질 (1-100, 기본값: 65)
 * @returns 최적화된 이미지 URL
 */
export default function optimizeImage(
  url: string | null | undefined,
  width: number,
  quality: number = 65
): string | null {
  if (!url) return null

  // 이미 transformation URL인지 확인
  if (url.includes('/storage/v1/render/image/')) {
    // 이미 최적화된 URL이면 그대로 반환
    return url
  }

  // Supabase storage URL인지 확인
  const supabasePattern = /\/storage\/v1\/object\/public\//

  if (!supabasePattern.test(url)) {
    // Supabase 이미지가 아니면 원본 반환
    return url
  }

  // /storage/v1/object/public/ → /storage/v1/render/image/public/
  const optimizedUrl = url.replace(
    '/storage/v1/object/public/',
    '/storage/v1/render/image/public/'
  )

  // width, quality, resize 파라미터 추가
  const separator = optimizedUrl.includes('?') ? '&' : '?'
  return `${optimizedUrl}${separator}width=${width}&quality=${quality}&resize=contain`
}

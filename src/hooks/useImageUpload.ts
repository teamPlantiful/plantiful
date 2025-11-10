import { useState, useCallback, ChangeEvent } from 'react'

interface UseImageUploadReturn {
  selectedImage: File | null
  previewUrl: string | null
  handleImageSelect: (e: ChangeEvent<HTMLInputElement>) => void
  handleImageRemove: () => void
  error: string | null
}

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]

export default function useImageUpload(): UseImageUploadReturn {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 파일 크기 검증
    if (file.size > MAX_FILE_SIZE) {
      setError('파일 크기는 5MB 이하여야 합니다.')
      return
    }

    // 파일 타입 검증 (사진 형식만 허용, GIF/SVG 등 제외)
    if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
      setError('사진 형식(JPG, PNG, WEBP, HEIC)만 업로드 가능합니다.')
      return
    }

    setError(null)
    setSelectedImage(file)

    // 미리보기 URL 생성
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleImageRemove = useCallback(() => {
    setSelectedImage(null)
    setPreviewUrl(null)
    setError(null)
  }, [])

  return {
    selectedImage,
    previewUrl,
    handleImageSelect,
    handleImageRemove,
    error,
  }
}

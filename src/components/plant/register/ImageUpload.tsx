'use client'

import { Camera, X } from 'lucide-react'
import cn from '@/lib/cn'
import useImageUpload from '@/hooks/useImageUpload'
import { useRef, useEffect } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  className?: string
  onImageChange?: (file: File | null) => void
  initialImageUrl?: string | null
  name?: string
}

export default function ImageUpload({
  className,
  onImageChange,
  initialImageUrl,
  name,
}: ImageUploadProps) {
  const { previewUrl, setPreviewUrl, handleImageSelect, handleImageRemove, error } =
    useImageUpload()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialImageUrl) {
      setPreviewUrl(initialImageUrl)
    }
  }, [initialImageUrl, setPreviewUrl])

  const handleClick = () => {
    inputRef.current?.click()
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleImageSelect(e)
    const file = e.target.files?.[0] || null
    onImageChange?.(file)
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    handleImageRemove()
    onImageChange?.(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        name={name}
        onChange={handleChange}
        className="hidden"
      />

      {previewUrl ? (
        <div className="relative w-32 h-32">
          <Image src={previewUrl} alt="Preview" fill className="rounded-lg object-cover" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 cursor-pointer bg-destructive text-destructive-foreground rounded-full p-1 shadow-md"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={handleClick}
          className="flex flex-col cursor-pointer items-center justify-center w-32 h-32 border-2 border-dashed border-border rounded-lg hover:bg-accent/20 transition-colors"
        >
          <Camera className="h-10 w-10 text-muted-foreground mb-2" />
          <span className="text-sm text-muted-foreground font-medium">사진 선택</span>
        </div>
      )}

      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

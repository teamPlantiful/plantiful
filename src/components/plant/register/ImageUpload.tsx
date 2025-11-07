'use client'

import { Camera } from 'lucide-react'
import cn from '@/lib/cn'

interface ImageUploadProps {
  className?: string
}

export function ImageUpload({ className }: ImageUploadProps) {
  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="flex flex-col cursor-pointer items-center justify-center w-32 h-32 border-2 border-dashed border-border rounded-lg hover:bg-accent/20 transition-colors">
        <Camera className="h-10 w-10 text-muted-foreground mb-2" />
        <span className="text-sm text-muted-foreground font-medium">사진 선택</span>
      </div>
    </div>
  )
}

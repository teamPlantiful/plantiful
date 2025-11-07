'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import cn from '@/lib/cn'
import Button from '../common/button'

interface CareInfo {
  sunlight: string
  waterAmount: string
  temperature: string
  humidity: string
}

interface CareGuideSectionProps {
  careInfo: CareInfo
  className?: string
}

export function CareGuideSection({ careInfo, className }: CareGuideSectionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={cn('w-full border-none', className)}>
      <div className="flex w-full items-center justify-between py-3">
        <span className="text-sm font-semibold">생육 환경 가이드</span>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 cursor-pointer">
          <ChevronDown className={cn('h-4 w-4transition-transform', isOpen && 'rotate-180')} />
        </button>
      </div>

      {isOpen && (
        <div className="p-4 rounded-lg bg-accent/20 text-foreground/80 border-2 border-dashed space-y-2 text-sm font-medium">
          <div className="flex justify-between">
            <span>햇빛:</span>
            <span>{careInfo.sunlight}</span>
          </div>
          <div className="flex justify-between">
            <span>물주는 양:</span>
            <span>{careInfo.waterAmount}</span>
          </div>
          <div className="flex justify-between">
            <span>온도:</span>
            <span>{careInfo.temperature}</span>
          </div>
          <div className="flex justify-between">
            <span>습도:</span>
            <span>{careInfo.humidity}</span>
          </div>
        </div>
      )}
    </div>
  )
}

'use client'

import { ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import cn from '@/lib/cn'
import { CareInfo } from '@/types/plant'
import { PlantCodeMapper } from '@/utils/plantCodeMapper'

interface CareGuideSectionProps {
  careInfo: CareInfo
  className?: string
}

export function CareGuideSection({ careInfo, className }: CareGuideSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && wrapperRef.current) {
      // 약간의 딜레이 후 스크롤 다운
      setTimeout(() => {
        const element = wrapperRef.current
        if (!element) return

        // 스크롤 컨테이너 찾기
        let scrollContainer = element.parentElement
        while (scrollContainer) {
          const overflow = window.getComputedStyle(scrollContainer).overflowY
          if (overflow === 'auto' || overflow === 'scroll') break
          scrollContainer = scrollContainer.parentElement
        }

        if (scrollContainer) {
          // 요소의 하단까지 스크롤
          const elementBottom = element.offsetTop + element.offsetHeight + 20
          scrollContainer.scrollTo({
            top: elementBottom - scrollContainer.clientHeight,
            behavior: 'smooth',
          })
        }
      }, 100)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} className={cn('w-full border-none', isOpen && 'mb-5', className)}>
      <div className="flex w-full text-foreground/80 items-center justify-between py-3">
        <span className="text-sm font-semibold">생육 환경 가이드</span>
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="p-1 cursor-pointer">
          <ChevronDown className={cn('h-4 w-4transition-transform', isOpen && 'rotate-180')} />
        </button>
      </div>

      {isOpen && (
        <div className="p-4 rounded-lg bg-accent/20 text-foreground/80 border-2 border-dashed space-y-2 text-sm font-medium">
          <div className="flex justify-between">
            <span>광도:</span>
            <span>{PlantCodeMapper.getLightDemand(careInfo.lightDemandCode)}</span>
          </div>
          <div className="flex justify-between">
            <span>온도:</span>
            <span>{PlantCodeMapper.getTemperature(careInfo.temperatureCode)}</span>
          </div>
          <div className="flex justify-between">
            <span>습도:</span>
            <span>{PlantCodeMapper.getHumidity(careInfo.humidityCode)}</span>
          </div>
          <div className="flex justify-between">
            <span>물주기:</span>
            <span>{PlantCodeMapper.getWaterCycle(careInfo.waterCycleCode)}</span>
          </div>
        </div>
      )}
    </div>
  )
}

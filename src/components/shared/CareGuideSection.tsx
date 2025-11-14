'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'
import cn from '@/lib/cn'
import { CareInfo } from '@/types/plant'
import { PlantCodeMapper } from '@/utils/plantCodeMapper'

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

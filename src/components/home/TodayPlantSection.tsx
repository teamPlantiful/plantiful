'use client'

import { useMemo } from 'react'
import { Card, CardContent } from '@/components/common/card'
import PlantCanvas from './PlantCanvas'
import { calculateDday } from '@/utils/date'
import type { Plant } from '@/types/plant'

type PlantState = 'normal' | 'thirsty'

interface TodayPlantSectionProps {
  plants: Plant[]
}

export default function TodayPlantSection({ plants }: TodayPlantSectionProps) {
  // 물주기가 가장 급한 식물 선택
  const urgentPlant = useMemo(() => {
    if (plants.length === 0) return null

    return [...plants].sort((a, b) => {
      const ddayA = a.nextWateringDate ? calculateDday(a.nextWateringDate) : Infinity
      const ddayB = b.nextWateringDate ? calculateDday(b.nextWateringDate) : Infinity
      return ddayA - ddayB
    })[0]
  }, [plants])

  const { plantState, dday } = useMemo(() => {
    if (!urgentPlant || !urgentPlant.nextWateringDate) {
      return { plantState: 'normal' as PlantState, dday: 0 }
    }

    // 유틸 함수 사용: D-day 계산
    const dday = calculateDday(urgentPlant.nextWateringDate)

    // D+1부터 시든 모습
    if (dday < 0) {
      return { plantState: 'thirsty' as PlantState, dday }
    }

    // D-day까지는 일반 모습
    return { plantState: 'normal' as PlantState, dday }
  }, [urgentPlant])

  return (
    <section>
      <Card className="overflow-hidden rounded-(--radius-lg) border-0">
        <CardContent className="p-0">
          <div className="relative w-full h-90 grid place-items-center rounded-[calc(var(--radius-lg)-2px)] bg-linear-to-b from-[hsl(103_43%_92%)] to-[hsl(60_10%_98%)]">
            {/* 항상 3D 모델 표시 */}
            <PlantCanvas state={plantState} />

            {/* 식물이 있을 때만 정보 표시 */}
            {urgentPlant && (
              <>
                {/* 식물 이름 */}
                <div className="absolute top-4 left-6 text-lg font-medium text-foreground/80">
                  <p>{urgentPlant.nickname}</p>
                </div>

                {/* 상태 메시지 */}
                <div className="absolute top-4 right-4 px-3 py-2 rounded-md bg-card text-sm font-medium text-foreground/80 border-2 border-dashed">
                  {plantState === 'thirsty' && <p>🥵 물이 필요해요 (D+{Math.abs(dday)})</p>}
                  {plantState === 'normal' && dday === 0 && <p>💧 물을 주는 날이에요!</p>}
                  {plantState === 'normal' && dday > 0 && <p>🌱 건강해요 (D-{dday})</p>}
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

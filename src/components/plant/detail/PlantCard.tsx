'use client'

import { useState, useMemo } from 'react'
import { Droplets } from 'lucide-react'
import Button from '@/components/common/button'
import { Card } from '@/components/common/card'
import cn from '@/lib/cn'
import type { PlantCardInfo } from '@/types/plant'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'

export default function PlantCard({
  id,
  nickname,
  speciesName,
  coverImageUrl,
  defaultImageUrl,
  ddayWater,
  onWater,
  onClick,
  className,
}: PlantCardInfo) {
  const [isWatering, setIsWatering] = useState(false)

  const image = useMemo(
    () => coverImageUrl || defaultImageUrl || '',
    [coverImageUrl, defaultImageUrl]
  )

  const handleCardClick = () => onClick(id)

  const ddayVariant = useMemo<'urgent' | 'warning' | 'normal'>(() => {
    if ((ddayWater = 0)) return 'urgent'
    if (ddayWater <= 3) return 'warning'
    return 'normal'
  }, [ddayWater])

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => e.key === 'Enter' && handleCardClick()}
      className={cn(
        'group cursor-pointer select-none border border-border bg-card p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[(--color-shadow-float)]',
        'h-full',
        className
      )}
      aria-label={`${nickname} 카드 열기`}
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/20">
          {image ? (
            <img src={image} alt={nickname} className="h-full w-full object-cover" />
          ) : (
            <img
              src="https://placehold.co/48x48/EBF4E5/3B5935?text=?"
              alt="placeholder"
              className="h-full w-full object-cover opacity-80"
            />
          )}
        </div>

        {/* 텍스트(닉네임/종명 + D-Day) */}
        <div className="min-w-0 flex-1">
          <div className="mb-0.5 truncate text-base font-semibold text-foreground">{nickname}</div>
          {speciesName ? (
            <div className="truncate text-xs italic text-muted-foreground">{speciesName}</div>
          ) : (
            <div className="h-4 text-xs text-transparent">.</div>
          )}

          <div
            className={cn(
              'mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition',
              ddayVariant === 'urgent' && 'bg-destructive/10 text-destructive',
              ddayVariant === 'warning' && 'bg-accent/30 text-foreground',
              ddayVariant === 'normal' && 'bg-secondary/20 text-secondary'
            )}
          >
            {ddayWater >= 0 ? `D-${ddayWater}` : `D+${Math.abs(ddayWater)}`}
          </div>
        </div>

        {/* 물주기 버튼 */}
        <form action={updateWaterPlantAction} onSubmit={(e) => {}}>
          <input type="hidden" name="id" value={id} />
          <Button
            type="submit"
            aria-label="물주기"
            title="물주기"
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onWater?.(id)
              setIsWatering(true)
              setTimeout(() => setIsWatering(false), 600)
            }}
            className={cn(
              'h-10 w-10 shrink-0 rounded-full transition-all hover:bg-secondary/20 hover:text-secondary',
              isWatering && 'animate-water-drop'
            )}
          >
            <Droplets className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </Card>
  )
}

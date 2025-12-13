'use client'

import { useState, useMemo } from 'react'
import type React from 'react'
import { Droplets } from 'lucide-react'
import Button from '@/components/common/button'
import { Card } from '@/components/common/card'
import cn from '@/lib/cn'
import type { PlantCardInfo } from '@/types/plant'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'
import Image from 'next/image'
import optimizeImage from '@/utils/optimizeImage'
import { notifyInApp } from '@/utils/notifyInApp'
import { toast } from '@/store/useToastStore'

export default function PlantCard({
  id,
  nickname,
  speciesName,
  coverImageUrl,
  defaultImageUrl,
  ddayWater,
  lastWateredAt,
  onWater,
  onClick,
  className,
  priority = false,
}: PlantCardInfo & { priority?: boolean }) {
  const [isWatering, setIsWatering] = useState(false)

  const image = useMemo(() => {
    const rawUrl = coverImageUrl || defaultImageUrl || ''
    // Retina 대응: 64px 이미지이므로 128px (2x) 요청
    return optimizeImage(rawUrl, 128) || rawUrl
  }, [coverImageUrl, defaultImageUrl])

  const handleCardClick = () => onClick(id)

  const ddayVariant = useMemo<'urgent' | 'warning' | 'normal'>(() => {
    if (ddayWater === 0) return 'urgent'
    if (ddayWater <= 3) return 'warning'
    return 'normal'
  }, [ddayWater])

  const isWateredToday = useMemo(() => {
    if (!lastWateredAt) return false
    const last = new Date(lastWateredAt)
    const now = new Date()

    return (
      last.getFullYear() === now.getFullYear() &&
      last.getMonth() === now.getMonth() &&
      last.getDate() === now.getDate()
    )
  }, [lastWateredAt])

  const imageSrc = image || 'https://placehold.co/64x64/EBF4E5/3B5935.png?text=%3F'

  const handleWaterClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (isWateredToday) {
      e.preventDefault()
      toast(`${nickname}은 오늘 이미 물을 줬어요.`, 'info')
      return
    }

    // 오늘 처음 물 주는 경우만 서버 액션 + 인앱알림
    onWater?.(id)
    setIsWatering(true)

    // 알림센터 + 토스트 동시 처리
    notifyInApp({
      title: `${nickname} 물주기 완료 💧`,
      body: '오늘 물을 줬어요.',
      toastMessage: `${nickname} 물주기 완료`,
      toastType: 'success',
      event: 'WATERED',
      plantId: id,
    })

    setTimeout(() => setIsWatering(false), 600)
  }

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
        {/* 물주기 버튼 */}
        <form action={updateWaterPlantAction}>
          <input type="hidden" name="id" value={id} />
          <Button
            type="submit"
            aria-label="물주기"
            title="물주기"
            size="icon"
            variant="ghost"
            disabled={isWatering}
            onClick={handleWaterClick}
            className={cn(
              'h-10 w-10 shrink-0 rounded-full transition-all hover:bg-secondary/20 hover:text-secondary',
              isWateredToday &&
                'cursor-not-allowed opacity-60 hover:bg-transparent hover:text-muted-foreground',
              isWatering && 'animate-water-drop'
            )}
          >
            <Droplets className="h-5 w-5" />
          </Button>
        </form>
        <div className="min-w-0 flex-1">
          <div className="mb-1 truncate text-base font-semibold text-foreground">{nickname}</div>
          {speciesName ? (
            <div className="ml-0.5 mb-1 truncate text-xs text-muted-foreground">{speciesName}</div>
          ) : (
            <div className="h-4 text-xs text-transparent">.</div>
          )}

          <div
            className={cn(
              'mt-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition',
              ddayVariant === 'urgent' && 'bg-destructive/10 text-red-700',
              ddayVariant === 'warning' && 'bg-accent/30 text-foreground',
              ddayVariant === 'normal' && 'bg-secondary/20 text-primary'
            )}
          >
            {ddayWater >= 0 ? `D-${ddayWater}` : `D+${Math.abs(ddayWater)}`}
          </div>
        </div>
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-secondary/20">
          <Image
            src={imageSrc}
            alt={nickname || '식물 이미지'}
            width={64}
            height={64}
            className="object-contain"
            priority={priority}
            {...(priority && {
              fetchPriority: 'high' as const,
              loading: 'eager' as const,
            })}
          />
        </div>
      </div>
    </Card>
  )
}

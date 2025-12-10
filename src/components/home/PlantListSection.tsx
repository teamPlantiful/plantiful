'use client'

import { useState, useMemo } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
import { addDays, calculateDday } from '@/utils/date'
import type { Plant } from '@/types/plant'
import type { PlantIntervalsUpdatePayload } from '@/components/plant/detail/PlantDetailSettingsTab'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PlantListSkeleton from '@/components/plant/search/PlantListSkeleton'

interface PlantListSectionProps {
  plants: Plant[]
  isLoading: boolean
  search?: string
  sort?: 'water' | 'name' | 'recent'

  hasNextPage: boolean
  fetchNextPage: () => void
  isFetchingNextPage: boolean

  onWater: (id: string) => void
  onSaveNickname: (id: string, nextName: string) => void
  onSaveIntervals: (id: string, next: PlantIntervalsUpdatePayload) => void
  onDelete: (id: string) => void
}

export default function PlantListSection({
  plants,
  isLoading,
  hasNextPage,
  fetchNextPage,
  isFetchingNextPage,
  onWater,
  onSaveNickname,
  onSaveIntervals,
  onDelete,
}: PlantListSectionProps) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const loadMoreRef = useInfiniteScroll({ hasNextPage, fetchNextPage })

  // 선택된 식물
  const selected = useMemo(
    () => plants.find((p) => p.id === selectedId) ?? null,
    [plants, selectedId]
  )

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleWater = (id: string) => {
    onWater(id)
  }

  const handleSaveNickname = async (nextName: string) => {
    if (!selected) return
    const trimmed = nextName.trim()
    if (!trimmed) return
    onSaveNickname(selected.id, trimmed)
  }

  const handleSaveIntervals = (next: PlantIntervalsUpdatePayload) => {
    if (!selected) return
    onSaveIntervals(selected.id, next)
  }

  const handleDelete = async () => {
    if (!selected) return
    onDelete(selected.id)
    setOpen(false)
  }

  // 초기 로딩 시 skeleton UI
  if (isLoading) {
    return (
      <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
        <div className="md:col-span-2">
          <PlantListSkeleton count={6} />
        </div>
      </section>
    )
  }

  // 빈 목록
  if (plants.length === 0) {
    return (
      <section className="py-10 text-center">
        <p className="text-muted-foreground">아직 등록된 식물이 없습니다 🌱</p>
      </section>
    )
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {plants.map((p, index) => {
            const ddayWater =
              p.lastWateredAt && p.wateringIntervalDays
                ? calculateDday(addDays(p.lastWateredAt, p.wateringIntervalDays))
                : 0

            return (
              <PlantCard
                key={p.id}
                id={p.id}
                nickname={p.nickname}
                speciesName={p.koreanName}
                coverImageUrl={p.coverImageUrl}
                defaultImageUrl={p.defaultImageUrl}
                ddayWater={ddayWater}
                lastWateredAt={p.lastWateredAt}
                onClick={handleCardClick}
                onWater={handleWater}
                className="w-full"
                priority={index === 0}
              />
            )
          })}
        </section>

        {/* Infinite Scroll */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="w-full">
            {isFetchingNextPage ? (
              <div className="mt-4">
                <PlantListSkeleton count={2} />
              </div>
            ) : (
              <div className="h-4" />
            )}
          </div>
        )}
      </div>

      {/* 상세 모달 */}
      {open && selected && (
        <PlantDetailModal
          open={open}
          onClose={() => setOpen(false)}
          plant={selected}
          onDelete={handleDelete}
          onSaveNickname={handleSaveNickname}
          onSaveIntervals={handleSaveIntervals}
        />
      )}
    </>
  )
}

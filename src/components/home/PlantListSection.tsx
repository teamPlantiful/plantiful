'use client'

import { useState, useMemo } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
import { addDays, calculateDday } from '@/utils/date'
import type { Plant } from '@/types/plant'
import type { PlantIntervalsUpdatePayload } from '@/components/plant/detail/PlantDetailSettingsTab'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'

// ✅ 스켈레톤 컴포넌트 import (경로 확인 필요)
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

  // 1️⃣ 초기 로딩 상태 처리 (데이터가 없고 로딩 중일 때)
  if (isLoading) {
    return (
      <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
         {/* 그리드 모양을 맞추기 위해 스켈레톤을 2번 렌더링하거나, 
             PlantListSkeleton 내부의 space-y-2를 제거하고 여기서 map을 돌리는 게 좋지만
             일단 간단하게 그대로 사용합니다. */}
         <div className="md:col-span-2">
            <PlantListSkeleton count={6} />
         </div>
      </section>
    )
  }

  // 데이터가 아예 없을 때
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
        {/* 실제 식물 리스트 */}
        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {plants.map((p) => {
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
              />
            )
          })}
        </section>

        {/* 2️⃣ 무한 스크롤 감지 및 추가 로딩 스켈레톤 */}
        {hasNextPage && (
          <div ref={loadMoreRef} className="w-full">
            {isFetchingNextPage ? (
              // 추가 데이터를 불러올 때는 하단에 2개 정도만 보여줍니다.
              <div className="mt-4">
                 <PlantListSkeleton count={2} />
              </div>
            ) : (
              // 감지용 투명 박스
              <div className="h-4" /> 
            )}
          </div>
        )}
      </div>

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
'use client'

import { useMemo, useState } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import { useGetPlants } from '@/hooks/queries/useGetPlants'
import { useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
interface PlantListSectionProps {
  search?: string
  sort?: 'water' | 'name' | 'recent'
}

export default function PlantListSection({ search = '', sort = 'water' }: PlantListSectionProps) {
  const { data: plants = [], isLoading } = useGetPlants()
  const queryClient = useQueryClient()

  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sortedPlants = useMemo(() => {
    // 1. 검색 필터링
    let filtered = plants
    if (search) {
      filtered = plants.filter((plant) =>
        plant.nickname.toLowerCase().includes(search.toLowerCase())
      )
    }

    // 2. 정렬
    if (sort === 'name') {
      return [...filtered].sort((a, b) => a.nickname.localeCompare(b.nickname))
    }
    if (sort === 'recent') {
      return [...filtered].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
    // 물주기 우선 정렬
    return [...filtered].sort((a, b) => {
      const ddayA = a.nextWateringDate
        ? Math.floor((new Date(a.nextWateringDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : Infinity
      const ddayB = b.nextWateringDate
        ? Math.floor((new Date(b.nextWateringDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : Infinity
      return ddayA - ddayB
    })
  }, [plants, sort, search])

  const selected = useMemo(
    () => plants.find((p) => p.id === selectedId) ?? null,
    [plants, selectedId]
  )

  const updatePlantsCache = (updater: (prev: Plant[]) => Plant[]) => {
    queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev) => {
      const safePrev = prev ?? []
      return updater(safePrev)
    })
  }

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleWater = async (id: string) => {
    const now = new Date().toISOString()
    updatePlantsCache((prev) => prev.map((p) => (p.id === id ? { ...p, lastWateredAt: now } : p)))
  }
  // 모달 내의 엑션들
  const handleSaveNickname = (nextName: string) => {
    if (!selectedId) return
    updatePlantsCache((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, nickname: nextName } : p))
    )
    setOpen(false)
  }

  const handleSaveIntervals = (next: {
    watering: number
    fertilizer: number
    repotting: number
  }) => {
    if (!selectedId) return

    updatePlantsCache((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? {
              ...p,
              wateringIntervalDays: next.watering,
              fertilizerIntervalDays: next.fertilizer,
              repottingIntervalDays: next.repotting,
            }
          : p
      )
    )
    setOpen(false)
  }

  const handleDelete = () => {
    if (!selectedId) return
    updatePlantsCache((prev) => prev.filter((p) => p.id !== selectedId))
    setOpen(false)
  }

  return (
    <>
      {/* 식물 목록 */}
      {isLoading ? (
        <section>
          <p className="text-center text-muted-foreground">식물 목록을 불러오는 중...</p>
        </section>
      ) : sortedPlants.length === 0 ? (
        <section>
          <p className="text-center text-muted-foreground">아직 등록된 식물이 없습니다</p>
        </section>
      ) : (
        <section className="grid gap-3 grid-cols-1 md:grid-cols-2">
          {sortedPlants.map((p) => {
            const ddayWater = p.nextWateringDate
              ? Math.floor(
                  (new Date(p.nextWateringDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                )
              : 0

            return (
              <PlantCard
                key={p.id}
                id={p.id}
                nickname={p.nickname}
                speciesName={p.scientificName}
                coverImageUrl={p.coverImageUrl}
                defaultImageUrl={p.defaultImageUrl}
                ddayWater={ddayWater}
                onClick={handleCardClick}
                onWater={handleWater}
                className="w-full"
              />
            )
          })}
        </section>
      )}
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

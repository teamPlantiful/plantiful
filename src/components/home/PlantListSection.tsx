'use client'

import { useEffect, useMemo, useState } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
import { normalizeSearch } from '@/utils/normalizeSearch'
import { calculateDday } from '@/utils/date'
import type { Plant } from '@/types/plant'

interface PlantListSectionProps {
  plants: Plant[]
  isLoading: boolean
  search?: string
  sort?: 'water' | 'name' | 'recent'
}

export default function PlantListSection({
  plants,
  isLoading,
  search = '',
  sort = 'water',
}: PlantListSectionProps) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [clientPlants, setClientPlants] = useState<Plant[]>(plants)

  useEffect(() => {
    setClientPlants(plants)
  }, [plants])
  const sortedPlants = useMemo(() => {
    // 1. 검색 필터링 (완성형 + 초성 둘 다 지원)
    const { original: searchWord, chosung: searchCho } = normalizeSearch(search)
    let filtered = clientPlants

    if (searchWord || searchCho) {
      filtered = clientPlants.filter((plant) => {
        const nickname = plant.nickname ?? ''
        const { original: nickWord, chosung: nickCho } = normalizeSearch(nickname)
        const matchFull = !!searchWord && !!nickWord && nickWord.includes(searchWord)
        const matchCho = !!searchCho && !!nickCho && nickCho.startsWith(searchCho)
        return matchFull || matchCho
      })
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
      const ddayA = a.nextWateringDate ? calculateDday(a.nextWateringDate) : Infinity
      const ddayB = b.nextWateringDate ? calculateDday(b.nextWateringDate) : Infinity
      return ddayA - ddayB
    })
  }, [clientPlants, sort, search])

  const selected = useMemo(
    () => clientPlants.find((p) => p.id === selectedId) ?? null,
    [clientPlants, selectedId]
  )

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleWater = (id: string) => {
    setClientPlants((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p

        const now = Date.now()
        const nextWateringDate = new Date(
          now + p.wateringIntervalDays * 24 * 60 * 60 * 1000
        ).toISOString()

        return {
          ...p,
          lastWateredAt: new Date(now).toISOString(),
          nextWateringDate,
        }
      })
    )
  }
  // 모달 내의 엑션들
  const handleSaveNickname = async (nextName: string) => {
    if (!selectedId) return
    const trimmed = nextName.trim()
    if (!trimmed) return
    setClientPlants((prev) =>
      prev.map((p) => (p.id === selectedId ? { ...p, nickname: trimmed } : p))
    )
  }

  const handleSaveIntervals = async (next: {
    watering: number
    fertilizer: number
    repotting: number
  }) => {
    const now = Date.now()
    const nextWateringDate = new Date(now + next.watering * 24 * 60 * 60 * 1000).toISOString()

    setClientPlants((prev) =>
      prev.map((p) =>
        p.id === selectedId
          ? {
              ...p,
              wateringIntervalDays: next.watering,
              fertilizerIntervalDays: next.fertilizer,
              repottingIntervalDays: next.repotting,
              nextWateringDate,
            }
          : p
      )
    )
  }

  const handleDelete = async () => {
    if (!selectedId) return
    setClientPlants((prev) => prev.filter((p) => p.id !== selectedId))
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
            const ddayWater = p.nextWateringDate ? calculateDday(p.nextWateringDate) : 0

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

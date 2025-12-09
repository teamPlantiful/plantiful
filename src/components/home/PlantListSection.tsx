'use client'

import { useEffect, useMemo, useState } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
import { normalizeSearch, isChosungOnly } from '@/utils/normalizeSearch'
import { addDays, calculateDday } from '@/utils/date'
import type { Plant } from '@/types/plant'
import type { PlantIntervalsUpdatePayload } from '@/components/plant/detail/PlantDetailSettingsTab'

interface PlantListSectionProps {
  plants: Plant[]
  isLoading: boolean
  search?: string
  sort?: 'water' | 'name' | 'recent'
  onWater: (id: string) => void
  onSaveNickname: (id: string, nextName: string) => void
  onSaveIntervals: (id: string, next: PlantIntervalsUpdatePayload) => void
  onDelete: (id: string) => void
}

export default function PlantListSection({
  plants,
  isLoading,
  search = '',
  sort = 'water',
  onWater,
  onSaveNickname,
  onSaveIntervals,
  onDelete,
}: PlantListSectionProps) {
  const [open, setOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const sortedPlants = useMemo(() => {
    const { original: searchWord } = normalizeSearch(search)
    const useChosungSearch = isChosungOnly(searchWord)

    //초성 검색일 때만 클라이언트에서 추가 필터링
    if (searchWord && useChosungSearch) {
      return plants.filter((plant) => {
        const nickname = plant.nickname ?? ''
        const { original: nickWord, chosung: nickCho } = normalizeSearch(nickname)
        if (!nickWord) return false
        return nickCho.includes(searchWord)
      })
    }
    return plants
  }, [plants, search])

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

  // 모달 내의 액션들
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
          {sortedPlants.map((p, index) => {
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

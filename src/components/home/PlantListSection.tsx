'use client'

import { useMemo, useState } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import PlantDetailModal from '@/components/plant/detail/PlantDetailModal'
import { useWaterPlant } from '@/hooks/mutations/useWaterPlant'
import { useUpdatePlantIntervals } from '@/hooks/mutations/useUpdatePlantIntervals'
import { useUpdatePlantNickname } from '@/hooks/mutations/useUpdatePlantNickname'
import { useDeletePlant } from '@/hooks/mutations/useDeletePlant'
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
  const { mutateAsync: waterPlant } = useWaterPlant()
  const { mutateAsync: updateIntervals } = useUpdatePlantIntervals()
  const { mutateAsync: updateNickname } = useUpdatePlantNickname()
  const { mutateAsync: deletePlantMutation } = useDeletePlant()

  const sortedPlants = useMemo(() => {
    // 1. 검색 필터링 (완성형 + 초성 둘 다 지원)
    const { original: searchWord, chosung: searchCho } = normalizeSearch(search)
    let filtered = plants

    if (searchWord || searchCho) {
      filtered = plants.filter((plant) => {
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
  }, [plants, sort, search])

  const selected = useMemo(
    () => plants.find((p) => p.id === selectedId) ?? null,
    [plants, selectedId]
  )

  const handleCardClick = (id: string) => {
    setSelectedId(id)
    setOpen(true)
  }

  const handleWater = async (id: string) => {
    const now = new Date().toISOString()
    await waterPlant({ id, lastWateredAt: now })
  }
  // 모달 내의 엑션들
  const handleSaveNickname = async (nextName: string) => {
    if (!selectedId) return
    const trimmed = nextName.trim()
    if (!trimmed) {
      setOpen(false)
      return
    }

    await updateNickname({ id: selectedId, nickname: trimmed })
    setOpen(false)
  }

  const handleSaveIntervals = async (next: {
    watering: number
    fertilizer: number
    repotting: number
  }) => {
    if (!selectedId) return

    await updateIntervals({
      id: selectedId,
      wateringDays: next.watering,
      fertilizerDays: next.fertilizer,
      repottingDays: next.repotting,
    })

    setOpen(false)
  }

  const handleDelete = async () => {
    if (!selectedId) return
    await deletePlantMutation(selectedId)
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

'use client'

import { useMemo } from 'react'
import PlantCard from '@/components/plant/detail/PlantCard'
import { useGetPlants } from '@/hooks/queries/useGetPlants'

interface PlantListSectionProps {
  search?: string
  sort?: 'water' | 'name' | 'recent'
}

export default function PlantListSection({ search = '', sort = 'water' }: PlantListSectionProps) {
  const { data: plants = [], isLoading } = useGetPlants()

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

  const handleCardClick = (id: string) => {
    // TODO: 식물 상세 페이지 이동 구현
    console.log('Plant clicked:', id)
  }

  const handleWater = async (id: string) => {
    // TODO: Supabase에서 last_watered_at 업데이트
    // const { error } = await supabase
    //   .from('plants')
    //   .update({ last_watered_at: new Date().toISOString() })
    //   .eq('id', id)

    console.log('Water plant:', id)
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
    </>
  )
}

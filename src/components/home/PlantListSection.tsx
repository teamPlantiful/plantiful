'use client'

import { useMemo, useState } from 'react'
import Input from '@/components/common/Input'
import SelectBox from '@/components/common/select-box'
import PlantCard from '@/components/plant/detail/PlantCard'
import type { Plant } from '@/types/plant'
import { Search } from 'lucide-react'

export default function PlantListSection() {
  const [sort, setSort] = useState('water')
  const [plants, setPlants] = useState<Plant[]>([])

  // TODO: Supabase에서 식물 데이터 fetch
  // useEffect(() => {
  //   const fetchPlants = async () => {
  //     const { data } = await supabase
  //       .from('plants')
  //       .select('*')
  //       .order('created_at', { ascending: false })
  //     setPlants(data || [])
  //   }
  //   fetchPlants()
  // }, [])

  const sortedPlants = useMemo(() => {
    if (sort === 'name') {
      return [...plants].sort((a, b) => a.nickname.localeCompare(b.nickname))
    }
    if (sort === 'recent') {
      return [...plants].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    }
    // 물주기 우선 정렬
    return [...plants].sort((a, b) => {
      const ddayA = a.nextWateringDate
        ? Math.floor(
            (new Date(a.nextWateringDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : Infinity
      const ddayB = b.nextWateringDate
        ? Math.floor(
            (new Date(b.nextWateringDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
          )
        : Infinity
      return ddayA - ddayB
    })
  }, [plants, sort])

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
      {/* 검색 & 정렬 */}
      <section className="space-y-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <Input
              placeholder="식물 이름 검색"
              leftIcon={<Search className="size-4" />}
              aria-label="식물 검색"
              className="h-11 pl-10 rounded-md"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-foreground">내 식물들</h2>
          <SelectBox
            className="w-[140px]"
            value={sort}
            placeholder="정렬"
            options={[
              { value: 'water', label: '물주기 우선' },
              { value: 'name', label: '이름순' },
              { value: 'recent', label: '최근 등록순' },
            ]}
            onSelect={setSort}
          />
        </div>
      </section>

      {/* 식물 목록 */}
      {sortedPlants.length === 0 ? (
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

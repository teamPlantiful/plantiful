'use client'

import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegisterFab from '@/components/home/PlantRegisterFab'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useGetPlants } from '@/hooks/queries/useGetPlants'
import { useWaterPlant } from '@/hooks/mutations/useWaterPlant'
import { useUpdatePlantNickname } from '@/hooks/mutations/useUpdatePlantNickname'
import { useUpdatePlantIntervals } from '@/hooks/mutations/useUpdatePlantIntervals'
import { useDeletePlant } from '@/hooks/mutations/useDeletePlant'

type SortKey = 'water' | 'name' | 'recent'

export default function DashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const { data: plants = [], isLoading } = useGetPlants()

  const waterPlant = useWaterPlant()
  const updateNickname = useUpdatePlantNickname()
  const updateIntervals = useUpdatePlantIntervals()
  const deletePlant = useDeletePlant()

  // 1) URL에서 현재 값
  const search = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') as SortKey) ?? 'recent'
  // 2) URL 쿼리만 업데이트
  const setParams = (next: Partial<{ q: string; sort: SortKey }>) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '')

    const merged: { q: string; sort: SortKey } = {
      q: next.q ?? search,
      sort: next.sort ?? sort,
    }

    if (!merged.q) sp.delete('q')
    else sp.set('q', merged.q)

    if (!merged.sort || merged.sort === 'recent') sp.delete('sort')
    else sp.set('sort', merged.sort)

    const query = sp.toString()
    const url = query ? `${pathname}?${query}` : pathname

    router.push(url)
  }

  const handleSearchChange = (value: string) => {
    setParams({ q: value })
  }

  const handleWater = (id: string) => {
    waterPlant.mutate({ id })
  }

  const handleSaveNickname = (id: string, nickname: string) => {
    updateNickname.mutate({ id, nickname })
  }

  const handleSaveIntervals = (
    id: string,
    next: { watering: number; fertilizer: number; repotting: number }
  ) => {
    updateIntervals.mutate({
      id,
      wateringDays: next.watering,
      fertilizerMonths: next.fertilizer,
      repottingMonths: next.repotting,
    })
  }

  const handleDelete = (id: string) => {
    deletePlant.mutate({ id })
  }

  return (
    <div>
      <div className="max-w-190 mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection plants={plants} />
        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={handleSearchChange}
          onSortChange={(value) => setParams({ sort: value })}
        />
        <PlantListSection
          plants={plants}
          isLoading={isLoading}
          search={search}
          sort={sort}
          onWater={handleWater}
          onSaveNickname={handleSaveNickname}
          onSaveIntervals={handleSaveIntervals}
          onDelete={handleDelete}
        />
      </div>
      <PlantRegisterFab />
    </div>
  )
}

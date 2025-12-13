'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegisterFab from '@/components/home/PlantRegisterFab'

import { useInfiniteMain } from '@/hooks/queries/useInfiniteMain'
import type { SortKey } from '@/types/plant'
import { useWaterPlant } from '@/hooks/mutations/useWaterPlant'
import { useUpdatePlantNickname } from '@/hooks/mutations/useUpdatePlantNickname'
import { useUpdatePlant } from '@/hooks/mutations/useUpdatePlant'
import { useDeletePlant } from '@/hooks/mutations/useDeletePlant'
import type { PlantIntervalsUpdatePayload } from '@/components/plant/detail/PlantDetailSettingsTab'

export default function DashboardClient() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // URL 기반 상태
  const search = searchParams.get('q') ?? ''
  const sort = (searchParams.get('sort') as SortKey) ?? 'recent'

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useInfiniteMain({
    q: search,
    sort,
  })

  const plants = data?.pages.flatMap((page) => page.items) ?? []

  const waterPlant = useWaterPlant()
  const updateNickname = useUpdatePlantNickname()
  const updateIntervals = useUpdatePlant()
  const deletePlant = useDeletePlant()

  // URL 업데이트
  const setParams = (next: Partial<{ q: string; sort: SortKey }>) => {
    const sp = new URLSearchParams(searchParams?.toString() ?? '')

    const merged = {
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

  const handleSortChange = (value: SortKey) => {
    setParams({ sort: value })
  }

  const handleWater = (id: string, nickname: string) => {
    waterPlant.mutate({ id, nickname })
  }

  const handleSaveNickname = (id: string, nickname: string) => {
    updateNickname.mutate({ id, nickname })
  }

  const handleSaveIntervals = (id: string, nickname: string, next: PlantIntervalsUpdatePayload) => {
    updateIntervals.mutate({
      id,
      nickname,
      wateringDays: next.wateringDays,
      fertilizerMonths: next.fertilizerMonths,
      repottingMonths: next.repottingMonths,
      adoptedAt: next.adoptedAt,
      lastWateredAt: next.lastWateredAt,
      file: next.file ?? undefined,
      removeImage: next.removeImage,
    })
  }

  const handleDelete = (id: string, nickname: string) => {
    deletePlant.mutate({ id, nickname })
  }

  return (
    <div>
      <div className="max-w-190 mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection plants={plants} />

        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={handleSearchChange}
          onSortChange={handleSortChange}
        />

        <PlantListSection
          plants={plants}
          isLoading={isLoading}
          search={search}
          sort={sort}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={hasNextPage}
          fetchNextPage={fetchNextPage}
          onWater={handleWater}
          onSaveNickname={handleSaveNickname}
          onSaveIntervals={handleSaveIntervals}
          onDelete={handleDelete}
        />
      </div>
      <PlantRegisterFab existingPlants={plants} />
    </div>
  )
}

'use client'

import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegisterFab from '@/components/home/PlantRegisterFab'
import { useState } from 'react'
import { useGetPlants, type SortKey } from '@/hooks/queries/useGetPlants'
import { useWaterPlant } from '@/hooks/mutations/useWaterPlant'
import { useUpdatePlantNickname } from '@/hooks/mutations/useUpdatePlantNickname'
import { useUpdatePlant } from '@/hooks/mutations/useUpdatePlant'
import { useDeletePlant } from '@/hooks/mutations/useDeletePlant'
import type { PlantIntervalsUpdatePayload } from '@/components/plant/detail/PlantDetailSettingsTab'

export default function DashboardClient() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortKey>('recent')

  //상태를 서버에 넘김
  const { data: plants = [], isLoading } = useGetPlants({ search, sort })

  const waterPlant = useWaterPlant()
  const updateNickname = useUpdatePlantNickname()
  const updateIntervals = useUpdatePlant()
  const deletePlant = useDeletePlant()

  const handleSearchChange = (value: string) => {
    setSearch(value)
  }

  const handleSortChange = (value: SortKey) => {
    setSort(value)
  }

  const handleWater = (id: string) => {
    waterPlant.mutate({ id })
  }

  const handleSaveNickname = (id: string, nickname: string) => {
    updateNickname.mutate({ id, nickname })
  }

  const handleSaveIntervals = (id: string, next: PlantIntervalsUpdatePayload) => {
    updateIntervals.mutate({
      id,
      wateringDays: next.wateringDays,
      fertilizerMonths: next.fertilizerMonths,
      repottingMonths: next.repottingMonths,
      adoptedAt: next.adoptedAt,
      lastWateredAt: next.lastWateredAt,
      file: next.file ?? undefined,
      removeImage: next.removeImage,
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
          onSortChange={handleSortChange}
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

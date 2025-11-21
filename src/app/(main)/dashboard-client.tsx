'use client'

import { useState } from 'react'
import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab'
import { useGetPlants } from '@/hooks/queries/useGetPlants'

export default function DashboardClient() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'water' | 'name' | 'recent'>('water')
  const { data: plants = [], isLoading } = useGetPlants()

  return (
    <div>
      <div className="max-w-180 mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection plants={plants} />
        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={setSearch}
          onSortChange={setSort}
        />
        <PlantListSection plants={plants} isLoading={isLoading} search={search} sort={sort} />
      </div>
      <PlantRegistrationFab />
    </div>
  )
}

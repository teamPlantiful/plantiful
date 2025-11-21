'use client'

import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useGetPlants } from '@/hooks/queries/useGetPlants'

type SortKey = 'water' | 'name' | 'recent'

export default function DashboardClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()

  const { data: plants = [], isLoading } = useGetPlants()

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
  return (
    <div>
      <div className="max-w-190 mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection plants={plants} />
        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={(value) => setParams({ q: value })}
          onSortChange={(value) => setParams({ sort: value })}
        />
        <PlantListSection plants={plants} isLoading={isLoading} search={search} sort={sort} />
      </div>
      <PlantRegistrationFab />
    </div>
  )
}

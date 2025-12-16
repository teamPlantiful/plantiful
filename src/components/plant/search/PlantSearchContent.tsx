'use client'

import { useMemo } from 'react'
import type { PlantSearchResult } from '@/types/plant'
import { useInfinitePlantSearch } from '@/hooks/queries/useInfinitePlantSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'
import PlantListSkeleton from './PlantListSkeleton'

interface PlantSearchContentProps {
  searchQuery: string
  setSearchQuery: (query: string) => void
  customName: string
  setCustomName: (name: string) => void
  onSelect: (species: PlantSearchResult | { commonName: string }) => void
}

export default function PlantSearchContent({
  searchQuery,
  setSearchQuery,
  customName,
  setCustomName,
  onSelect,
}: PlantSearchContentProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, error } =
    useInfinitePlantSearch(searchQuery)

  const observerRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
  })

  const plants = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? []
  }, [data])

  const showInitialLoading = isLoading || (isFetching && (!data || plants.length === 0))

  const handleSelect = (plant: PlantSearchResult) => {
    onSelect(plant)
  }

  const handleCustomSelect = () => {
    if (!customName.trim()) return
    onSelect({ commonName: customName })
  }

  return (
    <>
      <PlantSearchInput value={searchQuery} onChange={setSearchQuery} />

      <div className="h-[400px] overflow-y-auto mt-4 space-y-2 scrollbar-overlay">
        <PlantCustomInput
          value={customName}
          onChange={setCustomName}
          onSelect={handleCustomSelect}
        />

        <PlantList
          loading={showInitialLoading}
          error={error ? String(error) : null}
          plants={plants}
          searchQuery={searchQuery}
          onSelect={handleSelect}
        />

        <div ref={observerRef} className="w-full pt-2">
          {isFetchingNextPage && <PlantListSkeleton count={2} />}
        </div>
      </div>
    </>
  )
}

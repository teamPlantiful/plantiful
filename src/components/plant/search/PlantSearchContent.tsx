'use client'

import { useMemo } from 'react'
import type { PlantSearchResult } from '@/types/plant'
import { useInfinitePlantSearch } from '@/hooks/queries/useInfinitePlantSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfinitePlantSearch(searchQuery)

  const observerRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
  })

  const plants = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? []
  }, [data])

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

      {/* 스크롤 영역 */}
      <div className="h-[400px] overflow-y-auto mt-4 space-y-2 scrollbar-overlay">
        <PlantCustomInput
          value={customName}
          onChange={setCustomName}
          onSelect={handleCustomSelect}
        />

        <PlantList
          loading={false}
          error={error ? String(error) : null}
          plants={plants}
          searchQuery={searchQuery}
          onSelect={handleSelect}
        />

        {/* 무한 스크롤 */}
        <div
          ref={observerRef}
          className="h-12 w-full flex items-center justify-center text-gray-400 text-sm"
        >
          {isFetchingNextPage
            ? '데이터를 불러오는 중입니다...'
            : hasNextPage
              ? '스크롤하여 더보기'
              : '더 이상 결과가 없습니다.'}
        </div>
      </div>
    </>
  )
}

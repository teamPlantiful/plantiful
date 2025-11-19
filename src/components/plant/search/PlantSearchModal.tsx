'use client'

import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import { useState, useRef, useEffect, useMemo } from 'react'
import type { PlantSearchResult } from '@/types/plant'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'
import { useInfinitePlantSearch } from '@/hooks/useInfinitePlantSearch'

interface PlantSpeciesSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (species: PlantSearchResult | { commonName: string }) => void
}

export default function PlantSpeciesSearchModal({
  open,
  onOpenChange,
  onSelect,
}: PlantSpeciesSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [customName, setCustomName] = useState('')

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, error } =
    useInfinitePlantSearch(searchQuery)

  const scrollRef = useRef<HTMLDivElement | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  const isFetchingRef = useRef(isFetchingNextPage)

  useEffect(() => {
    isFetchingRef.current = isFetchingNextPage
  }, [isFetchingNextPage])

  useEffect(() => {
    if (!scrollRef.current || !loadMoreRef.current) return
    if (!hasNextPage) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && !isFetchingRef.current) {
          console.log('마지막')
          fetchNextPage()
        }
      },
      {
        root: scrollRef.current,
        threshold: 0,
        rootMargin: '1000px',
      }
    )

    observer.observe(loadMoreRef.current)
    return () => observer.disconnect()
  }, [hasNextPage, fetchNextPage])

  const plants = useMemo(() => {
    const allItems = data?.pages.flatMap((p) => p.items) ?? []

    return Array.from(new Map(allItems.map((item) => [item.id, item])).values())
  }, [data])

  const handleSelect = (plant: PlantSearchResult) => {
    onSelect(plant)
    setSearchQuery('')
  }

  const handleCustomSelect = () => {
    if (!customName.trim()) return
    onSelect({ commonName: customName })
    setCustomName('')
  }

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      closeOnBackdrop
      size="md"
      className="flex flex-col max-h-[85vh]"
    >
      <ModalHeader className="pb-4" closable onClose={() => onOpenChange(false)}>
        <h2 className="text-lg font-semibold">식물 종류 선택</h2>
      </ModalHeader>

      <ModalContent className="pt-0 pb-0">
        <PlantSearchInput value={searchQuery} onChange={setSearchQuery} />

        <div ref={scrollRef} className="h-[400px] overflow-y-auto mt-4 space-y-2">
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

          <div
            ref={loadMoreRef}
            className="h-12 w-full flex items-center justify-center text-gray-400 text-sm"
          >
            {isFetchingNextPage
              ? '데이터를 불러오는 중입니다...'
              : hasNextPage
                ? ''
                : '더 이상 결과가 없습니다'}
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}

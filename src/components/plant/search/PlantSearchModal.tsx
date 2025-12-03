'use client'

import { useState, useMemo } from 'react'
import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import type { PlantSearchResult } from '@/types/plant'
import { useInfinitePlantSearch } from '@/hooks/queries/useInfinitePlantSearch'
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'
import PlantListSkeleton from './PlantListSkeleton'

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

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, error } =
    useInfinitePlantSearch(searchQuery, open)

  const observerRef = useInfiniteScroll({
    hasNextPage,
    fetchNextPage,
  })

  const plants = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? []
  }, [data])

  const showInitialLoading = isLoading || (isFetching && (!data || plants.length === 0))

  const handleClose = () => {
    onOpenChange(false)
    setSearchQuery('')
    setCustomName('')
  }

  const handleSelect = (plant: PlantSearchResult) => {
    onSelect(plant)
    handleClose()
  }

  const handleCustomSelect = () => {
    if (!customName.trim()) return
    onSelect({ commonName: customName })
    handleClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeOnBackdrop
      size="md"
      className="flex flex-col max-h-[85vh]"
    >
      <ModalHeader className="pb-4" closable onClose={handleClose}>
        <h2 className="text-lg font-semibold">식물 종류 선택</h2>
      </ModalHeader>

      <ModalContent className="pt-0 pb-0">
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
      </ModalContent>
    </Modal>
  )
}

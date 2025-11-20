'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import type { PlantSearchResult } from '@/types/plant'
import { useInfinitePlantSearch } from '@/hooks/queries/useInfinitePlantSearch'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'

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

  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null)
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null)

  const plants = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? []
  }, [data])

  useEffect(() => {
    if (!scrollContainer || !loadMoreTriggerRef.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      },
      {
        root: scrollContainer,
        rootMargin: '200px',
        threshold: 0,
      }
    )

    observer.observe(loadMoreTriggerRef.current)

    return () => observer.disconnect()
  }, [scrollContainer, hasNextPage, isFetchingNextPage, fetchNextPage])

  // 핸들러
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

        {/* 스크롤 영역 */}
        <div ref={setScrollContainer} className="h-[400px] overflow-y-auto mt-4 space-y-2">
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

          {/* 무한 스크롤  */}
          <div
            ref={loadMoreTriggerRef}
            className="h-12 w-full flex items-center justify-center text-gray-400 text-sm"
          >
            {isFetchingNextPage
              ? '데이터를 불러오는 중입니다...'
              : hasNextPage
                ? '스크롤하여 더보기'
                : '더 이상 결과가 없습니다.'}
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}

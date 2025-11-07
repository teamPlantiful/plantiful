'use client'

import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import { useState } from 'react'
import { usePlantSearch, PerenualPlant } from '@/hooks/usePlantSearch'
import PlantSearchInput from './PlantSearchInput'
import PlantCustomInput from './PlantCustomInput'
import PlantList from './PlantList'

interface PlantSpeciesSearchModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (species: PerenualPlant | { common_name: string }) => void
}

export default function PlantSpeciesSearchModal({
  open,
  onOpenChange,
  onSelect,
}: PlantSpeciesSearchModalProps) {
  const { searchQuery, setSearchQuery, plants, loading, error, defaultPlants } = usePlantSearch()
  const [customName, setCustomName] = useState('')

  const handleSelect = (plant: PerenualPlant) => {
    onSelect(plant)
    onOpenChange(false)
    setSearchQuery('')
  }

  const handleCustomSelect = () => {
    if (!customName.trim()) return
    onSelect({ common_name: customName })
    setCustomName('')
    onOpenChange(false)
  }

  return (
    <Modal
      open={open}
      onClose={() => onOpenChange(false)}
      closeOnBackdrop
      size="md"
      className="flex flex-col max-h-[85vh]"
    >
      <ModalHeader className="px-4 py-3" closable onClose={() => onOpenChange(false)}>
        <h2 className="text-base font-semibold">식물 종류 선택</h2>
      </ModalHeader>

      <ModalContent className="pt-2">
        <PlantSearchInput value={searchQuery} onChange={setSearchQuery} />

        <div className="h-[400px] overflow-y-auto mt-4 px-4 pb-4 space-y-2">
          <PlantCustomInput
            value={customName}
            onChange={setCustomName}
            onSelect={handleCustomSelect}
          />
          <PlantList
            loading={loading}
            error={error}
            plants={plants}
            defaultPlants={defaultPlants}
            searchQuery={searchQuery}
            onSelect={handleSelect}
          />
        </div>
      </ModalContent>
    </Modal>
  )
}

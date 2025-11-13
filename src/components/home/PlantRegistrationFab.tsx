'use client'

import { useState } from 'react'
import Fab from '@/components/common/fab'
import PlantSpeciesSearchModal from '@/components/plant/search/PlantSearchModal'
import { RegisterPlantModal } from '@/components/plant/register/RegisterPlantModal'
import type { PlantSpeciesInfo, PlantSearchResult } from '@/types/plant'

export default function PlantRegistrationFab() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpeciesInfo | null>(null)

  const handlePlantSelect = (plant: PlantSearchResult | { commonName: string }) => {
    const isSearchResult = 'id' in plant
    const searchResult = isSearchResult ? (plant as PlantSearchResult) : null

    const plantSpecies: PlantSpeciesInfo = {
      cntntsNo: searchResult ? String(searchResult.id) : Date.now().toString(),
      koreanName: plant.commonName,
      scientificName: searchResult?.scientificName[0] ?? '',
      careInfo: {
        lightDemandCode: '055002',
        waterCycleCode: '053003',
        temperatureCode: '082002',
        humidityCode: '083002',
      },
    }

    setSelectedSpecies(plantSpecies)
    setIsSearchModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const handleBackToSearch = () => {
    setIsRegisterModalOpen(false)
    setIsSearchModalOpen(true)
  }

  return (
    <>
      <Fab onClick={() => setIsSearchModalOpen(true)} />
      <PlantSpeciesSearchModal
        open={isSearchModalOpen}
        onOpenChange={setIsSearchModalOpen}
        onSelect={handlePlantSelect}
      />
      <RegisterPlantModal
        open={isRegisterModalOpen}
        onOpenChange={setIsRegisterModalOpen}
        selectedSpecies={selectedSpecies}
        onBack={handleBackToSearch}
      />
    </>
  )
}

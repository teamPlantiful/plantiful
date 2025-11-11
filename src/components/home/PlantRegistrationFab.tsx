'use client'

import { useState } from 'react'
import Fab from '@/components/common/fab'
import PlantSpeciesSearchModal from '@/components/plant/search/PlantSearchModal'
import { RegisterPlantModal } from '@/components/plant/register/RegisterPlantModal'
import { PerenualPlant } from '@/hooks/usePlantSearch'
import type { PlantSpeciesInfo } from '@/types/plant'

export default function PlantRegistrationFab() {
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpeciesInfo | null>(null)

  const handlePlantSelect = (plant: PerenualPlant | { common_name: string }) => {
    // PerenualPlant를 PlantSpeciesInfo로 변환
    const isPerenualPlant = 'id' in plant
    const perenualPlant = isPerenualPlant ? (plant as PerenualPlant) : null

    const plantSpecies: PlantSpeciesInfo = {
      cntntsNo: perenualPlant ? String(perenualPlant.id) : Date.now().toString(),
      koreanName: plant.common_name,
      scientificName: perenualPlant?.scientific_name[0] ?? '',
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

  const handleRegister = (data: any) => {
    // TODO: Supabase에 식물 등록
    console.log('식물 등록:', data)
    setIsRegisterModalOpen(false)
    setSelectedSpecies(null)
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
        onRegister={handleRegister}
        onBack={handleBackToSearch}
      />
    </>
  )
}

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

  const handlePlantSelect = async (plant: PlantSearchResult | { commonName: string }) => {
    const isSearchResult = 'id' in plant

    // 1) 농사로 검색 결과인 경우 → 상세 API 호출
    if (isSearchResult) {
      const cntntsNo = String(plant.id)

      // 상세 API 요청
      const res = await fetch(`/apis/plantDetail/${cntntsNo}`)
      const detail: PlantSpeciesInfo = await res.json()

      setSelectedSpecies(detail)
    }
    // 2) 직접 입력한 경우
    else {
      const manualPlant: PlantSpeciesInfo = {
        cntntsNo: Date.now().toString(),
        koreanName: plant.commonName,
        scientificName: '',
      }

      setSelectedSpecies(manualPlant)
    }

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

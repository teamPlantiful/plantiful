'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import Fab from '@/components/common/fab'
import PlantSpeciesSearchModal from '@/components/plant/search/PlantSearchModal'
import { RegisterPlantModal } from '@/components/plant/register/RegisterPlantModal'
import type { PlantSpeciesInfo,PlantSearchResult } from '@/types/plant'

import { addCard } from '@/app/apis/supabaseApi'

export default function PlantRegistrationFab() {
  const queryClient = useQueryClient()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpeciesInfo | null>(null)

  const handlePlantSelect = (plant: PlantSearchResult | { commonName: string }) => {
    // PerenualPlant를 PlantSpeciesInfo로 변환
    const isSearchResult = 'id' in plant
    const searchResult = isSearchResult ? (plant as PlantSearchResult) : null

    const plantSpecies: PlantSpeciesInfo = {
      cntntsNo: searchResult? String(searchResult.id) : Date.now().toString(),
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

  const handleRegister = async (data: any) => {
    try {
      await addCard(data)
      console.log('식물 등록 성공:', data)
      setIsRegisterModalOpen(false)
      setSelectedSpecies(null)
      // 식물 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: ['plants'] })
    } catch (error) {
      console.error('식물 등록 실패:', error)
      alert('식물 등록에 실패했습니다. 다시 시도해주세요.')
    }
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

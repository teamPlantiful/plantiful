'use client'

import { useState } from 'react'
import Fab from '@/components/common/fab'
import PlantRegisterModal from '@/components/plant/register/PlantRegisterModal'
import type { Plant } from '@/types/plant'

interface PlantRegisterFabProps {
  existingPlants?: Plant[]
}

export default function PlantRegisterFab({ existingPlants }: PlantRegisterFabProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Fab
        onClick={() => setIsModalOpen(true)}
        className="fixed right-[calc((100vw-57rem)/2-1rem)] max-md:right-6 max-lg:right-8 "
      />
      <PlantRegisterModal open={isModalOpen} onOpenChange={setIsModalOpen} existingPlants={existingPlants} />
    </>
  )
}

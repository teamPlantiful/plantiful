'use client'

import { useState, useEffect } from 'react'
import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import { Alert } from '@/components/common/alert'
import Button from '@/components/common/button'
import { ArrowLeft } from 'lucide-react'
import type { PlantSearchResult, PlantSpeciesInfo, Plant } from '@/types/plant'
import PlantSearchContent from '../search/PlantSearchContent'
import PlantRegisterContent from './PlantRegisterContent'
import cn from '@/lib/cn'

type ModalStep = 'search' | 'register'

interface PlantRegisterModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  existingPlants?: Plant[]
}

export default function PlantRegisterModal({ open, onOpenChange, existingPlants = [] }: PlantRegisterModalProps) {
  // 단계 상태
  const [currentStep, setCurrentStep] = useState<ModalStep>('search')
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpeciesInfo | null>(null)

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [customName, setCustomName] = useState('')

  // 등록 폼 상태
  const [isFormDirty, setIsFormDirty] = useState(false)
  const [initialNickname, setInitialNickname] = useState('')

  // Alert 상태
  const [showAlert, setShowAlert] = useState(false)
  const [alertAction, setAlertAction] = useState<'back' | 'close'>('close')

  // 검색 → 등록 전환
  const handlePlantSelect = async (plant: PlantSearchResult | { commonName: string }) => {
    const isSearchResult = 'id' in plant

    if (isSearchResult) {
      // 농사로 검색 결과: API로 상세 정보 가져오기
      const cntntsNo = String(plant.id)
      const imageUrl = plant.defaultImage?.mediumUrl ?? ''

      const res = await fetch(
        `/apis/plantDetail/${cntntsNo}?imageUrl=${encodeURIComponent(imageUrl)}`
      )

      const detail: PlantSpeciesInfo = await res.json()
      detail.koreanName = plant.commonName

      setSelectedSpecies(detail)
      setInitialNickname('')
    } else {
      // 직접 입력: PlantSpeciesInfo 객체 생성
      const manualPlant: PlantSpeciesInfo = {
        cntntsNo: Date.now().toString(),
        koreanName: plant.commonName,
        scientificName: '',
        imageUrl: null,
      }

      setSelectedSpecies(manualPlant)
      setInitialNickname('')
    }

    // 등록 단계로 전환하고 검색 상태 초기화
    setCurrentStep('register')
    setSearchQuery('')
    setCustomName('')
  }

  // 등록 → 검색 되돌아가기
  const handleBackToSearch = () => {
    if (isFormDirty) {
      setAlertAction('back')
      setShowAlert(true)
    } else {
      setCurrentStep('search')
      setSelectedSpecies(null)
    }
  }

  // 모달 닫기
  const handleClose = () => {
    if (currentStep === 'register' && isFormDirty) {
      setAlertAction('close')
      setShowAlert(true)
    } else {
      onOpenChange(false)
    }
  }

  // Alert 확인 후 동작
  const handleConfirmAlert = () => {
    setShowAlert(false)

    if (alertAction === 'back') {
      setCurrentStep('search')
      setSelectedSpecies(null)
      setIsFormDirty(false)
    } else {
      onOpenChange(false)
    }
  }

  // 등록 완료
  const handleRegisterComplete = () => {
    onOpenChange(false)
  }

  // 모달이 닫힐 때 전체 상태 초기화
  useEffect(() => {
    if (!open) {
      setCurrentStep('search')
      setSelectedSpecies(null)
      setSearchQuery('')
      setCustomName('')
      setIsFormDirty(false)
      setInitialNickname('')
    }
  }, [open])

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        closeOnBackdrop={true}
        size="md"
        className="flex flex-col max-h-[90vh] w-full max-w-110"
      >
        <ModalHeader
          className="pb-4"
          closable
          onClose={handleClose}
          left={
            currentStep === 'register' ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToSearch}
                className="h-8 w-8 border border-border rounded-full mr-1"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            ) : undefined
          }
        >
          <h2 className="text-lg font-semibold">
            {currentStep === 'search' ? '식물 종류 선택' : '새 식물 등록'}
          </h2>
        </ModalHeader>

        <ModalContent
          className={cn('pt-0', currentStep === 'register' && 'pb-0 flex flex-col flex-1 min-h-0')}
        >
          {currentStep === 'search' ? (
            <PlantSearchContent
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              customName={customName}
              setCustomName={setCustomName}
              onSelect={handlePlantSelect}
            />
          ) : (
            selectedSpecies && (
              <PlantRegisterContent
                key={selectedSpecies.cntntsNo}
                selectedSpecies={selectedSpecies}
                initialNickname={initialNickname}
                existingPlants={existingPlants}
                onComplete={handleRegisterComplete}
                onDirtyChange={setIsFormDirty}
              />
            )
          )}
        </ModalContent>
      </Modal>

      <Alert
        open={showAlert}
        onClose={() => setShowAlert(false)}
        title="작성 중인 내용이 있습니다"
        description="작성된 내용을 잃을 수 있습니다. 창을 닫으시겠습니까?"
        confirmText="닫기"
        cancelText="취소"
        onConfirm={handleConfirmAlert}
        variant="destructive"
      />
    </>
  )
}

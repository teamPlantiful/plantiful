'use client'

import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import Button from '@/components/common/button'
import Input from '@/components/common/Input'
import SelectBox from '@/components/common/select-box'
import { ArrowLeft } from 'lucide-react'
import { useState } from 'react'
import { PlantSpeciesInfo, PlantData } from '@/types/plant'
import ImageUpload from './ImageUpload'
import { PlantInfo } from '../../shared/PlantInfo'
import { DateSelect } from './DateSelect'
import { CareGuideSection } from '../../shared/CareGuideSection'
import { generateDayOptions, generateMonthOptions } from '@/utils/date'

interface RegisterPlantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSpecies: PlantSpeciesInfo | null
  onRegister: (data: Omit<PlantData, 'species'> & { species: PlantSpeciesInfo }) => void
  onBack: () => void
}

const dayOptions = generateDayOptions()
const monthOptions = generateMonthOptions()

export const RegisterPlantModal = ({
  open,
  onOpenChange,
  selectedSpecies,
  onRegister,
  onBack,
}: RegisterPlantModalProps) => {
  const [nickname, setNickname] = useState('')
  const [wateringInterval, setWateringInterval] = useState('7')
  const [fertilizerInterval, setFertilizerInterval] = useState('1')
  const [repottingInterval, setRepottingInterval] = useState('12')
  const [lastWateredDate, setLastWateredDate] = useState<Date>(new Date())
  const [startDate, setStartDate] = useState<Date>(new Date())
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)

  // 필수 입력 필드 검증 (기본값이 있으면 활성화)
  const isFormValid =
    wateringInterval !== '' && fertilizerInterval !== '' && repottingInterval !== ''

  const handleClose = () => {
    onOpenChange(false)
    setUploadedImage(null)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedSpecies) return

    onRegister({
      species: selectedSpecies,
      nickname: nickname || selectedSpecies.koreanName,
      wateringInterval: parseInt(wateringInterval),
      fertilizerInterval: parseInt(fertilizerInterval) * 30,
      repottingInterval: parseInt(repottingInterval) * 30,
      lastWateredDate,
      startDate,
      image: selectedSpecies.imageUrl,
      uploadedImage: uploadedImage || undefined,
    })
    handleClose()

    setNickname('')
    setWateringInterval('7')
    setFertilizerInterval('1')
    setRepottingInterval('12')
    setLastWateredDate(new Date())
    setStartDate(new Date())
    setUploadedImage(null)
  }

  if (!selectedSpecies) return null

  return (
    <Modal open={open} onClose={handleClose} size="lg">
      <ModalHeader
        closable
        onClose={handleClose}
        className="px-6 pt-6 pb-4"
        left={
          <Button variant="ghost" size="icon" onClick={onBack} className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <h2 className="text-lg font-semibold">새 식물 등록</h2>
      </ModalHeader>

      <ModalContent className="flex-1 max-h-[75vh] overflow-y-auto custom-scrollbar px-6 pt-0 pb-0">
        <form onSubmit={handleSubmit} className="space-y-5 pb-6">
          <div className="p-6 rounded-lg bg-secondary/10 border border-border">
            <div className="flex flex-col items-center gap-4">
              <ImageUpload onImageChange={setUploadedImage} />
              <PlantInfo
                koreanName={selectedSpecies.koreanName}
                scientificName={selectedSpecies.scientificName}
                className="text-center"
              />
            </div>
          </div>

          <Input
            className="bg-card"
            label="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder={selectedSpecies.koreanName}
          />

          <div className="grid grid-cols-2 gap-3">
            <DateSelect label="처음 함께한 날짜" value={startDate} onChange={setStartDate} />
            <DateSelect
              label="마지막 물 준 날짜"
              value={lastWateredDate}
              onChange={setLastWateredDate}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">물주기</label>
              <SelectBox
                value={wateringInterval}
                placeholder="선택"
                options={dayOptions}
                onSelect={setWateringInterval}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">영양제</label>
              <SelectBox
                value={fertilizerInterval}
                placeholder="선택"
                options={monthOptions}
                onSelect={setFertilizerInterval}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">분갈이</label>
              <SelectBox
                value={repottingInterval}
                placeholder="선택"
                options={monthOptions}
                onSelect={setRepottingInterval}
              />
            </div>
          </div>

          <CareGuideSection careInfo={selectedSpecies.careInfo} />

          <Button type="submit" widthFull disabled={!isFormValid}>
            등록하기
          </Button>
        </form>
      </ModalContent>
    </Modal>
  )
}

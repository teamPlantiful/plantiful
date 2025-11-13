'use client'

import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import Button from '@/components/common/button'
import Input from '@/components/common/Input'
import SelectBox from '@/components/common/select-box'
import { ArrowLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { PlantSpeciesInfo, PlantData } from '@/types/plant'
import ImageUpload from './ImageUpload'
import { PlantInfo } from '../../shared/PlantInfo'
import { DateSelect } from './DateSelect'
import { CareGuideSection } from '../../shared/CareGuideSection'
import { generateDayOptions, generateMonthOptions } from '@/utils/date'
import { useAddPlant } from '@/hooks/queries/useAddPlant'

interface FormData {
  nickname: string
  wateringInterval: string
  fertilizerInterval: string
  repottingInterval: string
  lastWateredDate: Date
  startDate: Date
  uploadedImage: File | null
}

interface RegisterPlantModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedSpecies: PlantSpeciesInfo | null
  onBack: () => void
}

const dayOptions = generateDayOptions()
const monthOptions = generateMonthOptions()

export const RegisterPlantModal = ({
  open,
  onOpenChange,
  selectedSpecies,
  onBack,
}: RegisterPlantModalProps) => {
  const { mutate: addPlant, isPending } = useAddPlant()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<FormData>({
    defaultValues: {
      nickname: '',
      wateringInterval: '7',
      fertilizerInterval: '1',
      repottingInterval: '12',
      lastWateredDate: new Date(),
      startDate: new Date(),
      uploadedImage: null,
    },
    mode: 'onChange',
  })

  const handleClose = () => {
    onOpenChange(false)
  }

  const onSubmit = handleSubmit((data) => {
    if (!selectedSpecies) return

    const plantData: PlantData = {
      species: selectedSpecies,
      nickname: data.nickname || selectedSpecies.koreanName,
      wateringInterval: parseInt(data.wateringInterval),
      fertilizerInterval: parseInt(data.fertilizerInterval) * 30,
      repottingInterval: parseInt(data.repottingInterval) * 30,
      lastWateredDate: data.lastWateredDate,
      startDate: data.startDate,
      image: selectedSpecies.imageUrl,
      uploadedImage: data.uploadedImage || undefined,
    }

    addPlant(plantData, {
      onSuccess: () => {
        console.log('식물 등록 성공:', plantData)
        onOpenChange(false)
        reset()
      },
      onError: (error) => {
        console.error('식물 등록 실패:', error)
        alert('식물 등록에 실패했습니다. 다시 시도해주세요.')
      },
    })
  })

  // 모달이 닫힐 때 form 리셋
  useEffect(() => {
    if (!open && !isPending) {
      reset()
    }
  }, [open, isPending, reset])

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
        <form onSubmit={onSubmit} className="space-y-5 pb-6">
          <div className="p-6 rounded-lg bg-secondary/10 border border-border">
            <div className="flex flex-col items-center gap-4">
              <Controller
                name="uploadedImage"
                control={control}
                render={({ field }) => <ImageUpload onImageChange={field.onChange} />}
              />
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
            placeholder={selectedSpecies.koreanName}
            {...register('nickname')}
          />

          <div className="grid grid-cols-2 gap-3">
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DateSelect
                  label="처음 함께한 날짜"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              name="lastWateredDate"
              control={control}
              render={({ field }) => (
                <DateSelect
                  label="마지막 물 준 날짜"
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">물주기</label>
              <Controller
                name="wateringInterval"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    value={field.value}
                    placeholder="선택"
                    options={dayOptions}
                    onSelect={field.onChange}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">영양제</label>
              <Controller
                name="fertilizerInterval"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    value={field.value}
                    placeholder="선택"
                    options={monthOptions}
                    onSelect={field.onChange}
                  />
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground/80">분갈이</label>
              <Controller
                name="repottingInterval"
                control={control}
                render={({ field }) => (
                  <SelectBox
                    value={field.value}
                    placeholder="선택"
                    options={monthOptions}
                    onSelect={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <CareGuideSection careInfo={selectedSpecies.careInfo} />

          <Button type="submit" widthFull disabled={!isValid} isLoading={isPending}>
            등록하기
          </Button>
        </form>
      </ModalContent>
    </Modal>
  )
}

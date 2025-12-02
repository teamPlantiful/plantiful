'use client'

import { Modal, ModalHeader, ModalContent } from '@/components/common/modal'
import Button from '@/components/common/button'
import Input from '@/components/common/input'
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
import { useAddPlant } from '@/hooks/mutations/useAddPlant'
import { useGetPlants } from '@/hooks/queries/useGetPlants'
import cn from '@/lib/cn'

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
  const { mutate: addPlant } = useAddPlant()
  const { data: plants } = useGetPlants()
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
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
      nickname: data.nickname.trim(),
      wateringInterval: parseInt(data.wateringInterval),
      fertilizerInterval: parseInt(data.fertilizerInterval) * 30,
      repottingInterval: parseInt(data.repottingInterval) * 30,
      lastWateredDate: data.lastWateredDate,
      startDate: data.startDate,
      image: selectedSpecies.imageUrl || undefined,
      uploadedImage: data.uploadedImage || undefined,
    }

    // 즉시 모달 닫고 백그라운드에서 업로드
    onOpenChange(false)
    reset()

    addPlant(plantData, {
      onError: (error) => {
        console.error('식물 등록 실패:', error)
        alert('식물 등록에 실패했습니다. 다시 시도해주세요.')
      },
    })
  })

  // 모달이 닫힐 때 form 리셋
  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  if (!selectedSpecies) return null

  return (
    <Modal open={open} onClose={handleClose} size="md">
      <ModalHeader
        closable
        className="pb-4"
        onClose={handleClose}
        left={
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-8 w-8 border border-border rounded-full mr-1"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        }
      >
        <h2 className="text-lg font-semibold">새 식물 등록</h2>
      </ModalHeader>

      <ModalContent className="flex flex-col max-h-[80vh] -mx-6 -mb-6 border-t border-border">
        <form onSubmit={onSubmit} className="flex flex-col flex-1 min-h-0">
          {/* 스크롤 가능 영역 */}
          <div className="flex-1 overflow-y-auto pl-6 pr-6 pt-5 scrollbar-overlay">
            <div className="space-y-5">
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
                className="bg-card mb-1"
                label="식물 이름 *"
                {...register('nickname', {
                  required: '식물 이름을 입력해주세요.',
                  validate: (value) => {
                    const nickname = value.trim()
                    const isDuplicate = plants?.some(
                      (plant) => plant.nickname.toLowerCase() === nickname.toLowerCase()
                    )
                    return isDuplicate ? '이미 존재하는 이름입니다.' : true
                  },
                })}
                error={errors.nickname?.message}
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

              <div className={cn('grid grid-cols-3 gap-3', !selectedSpecies.careInfo && 'mb-5')}>
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

              {selectedSpecies.careInfo && (
                <CareGuideSection careInfo={selectedSpecies.careInfo} className="-mt-2" />
              )}
            </div>
          </div>

          <div className="pt-5 px-6 pb-6 border-t border-border">
            <Button type="submit" widthFull>
              등록하기
            </Button>
          </div>
        </form>
      </ModalContent>
    </Modal>
  )
}

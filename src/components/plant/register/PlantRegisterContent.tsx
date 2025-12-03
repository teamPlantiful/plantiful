'use client'

import Button from '@/components/common/button'
import Input from '@/components/common/input'
import SelectBox from '@/components/common/select-box'
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

interface PlantRegisterContentProps {
  selectedSpecies: PlantSpeciesInfo
  initialNickname?: string
  onComplete: () => void
  onDirtyChange?: (isDirty: boolean) => void
}

const dayOptions = generateDayOptions()
const monthOptions = generateMonthOptions()

export default function PlantRegisterContent({
  selectedSpecies,
  initialNickname = '',
  onComplete,
  onDirtyChange,
}: PlantRegisterContentProps) {
  const { mutate: addPlant } = useAddPlant()
  const { data: existingPlants } = useGetPlants()

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: {
      nickname: initialNickname,
      wateringInterval: '7',
      fertilizerInterval: '1',
      repottingInterval: '12',
      lastWateredDate: new Date(),
      startDate: new Date(),
      uploadedImage: null,
    },
    mode: 'onChange',
  })

  // isDirty 변경 시 부모에게 알림
  if (onDirtyChange) {
    onDirtyChange(isDirty)
  }

  const onSubmit = handleSubmit((data) => {
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

    // 완료 콜백 호출
    onComplete()

    addPlant(plantData, {
      onError: (error) => {
        console.error('식물 등록 실패:', error)
        alert('식물 등록에 실패했습니다. 다시 시도해주세요.')
      },
    })
  })

  return (
    <form
      onSubmit={onSubmit}
      className="flex flex-col flex-1 min-h-0 -mx-6 -mb-6 border-t border-border"
    >
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
                const isDuplicate = existingPlants?.some(
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
  )
}

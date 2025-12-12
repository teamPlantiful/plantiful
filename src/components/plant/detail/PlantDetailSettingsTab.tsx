'use client'

import { useEffect, useMemo, useState } from 'react'

import SelectBox from '@/components/common/select-box'
import Button from '@/components/common/button'
import { DateSelect } from '@/components/plant/register/DateSelect'
import ImageUpload from '@/components/plant/register/ImageUpload'

import type { Plant } from '@/types/plant'
import { generateDayOptions, generateMonthOptions } from '@/utils/date'
import { clamp, daysToMonths } from '@/utils/generateDay'

export interface PlantIntervalsUpdatePayload {
  wateringDays: number
  fertilizerMonths: number
  repottingMonths: number
  adoptedAt: Date
  lastWateredAt: Date
  file?: File | null
  removeImage?: boolean
}

interface PlantDetailSettingsTabProps {
  plant: Plant
  open: boolean
  confirmOnSave: boolean
  onSaveIntervals?: (next: PlantIntervalsUpdatePayload) => void
  onDone?: () => void
}

export default function PlantDetailSettingsTab({
  plant,
  open,
  confirmOnSave,
  onSaveIntervals,
  onDone,
}: PlantDetailSettingsTabProps) {
  const DAY_MAX = generateDayOptions(60)
  const MONTH_MAX = generateMonthOptions(24)

  const [wateringInterval, setWateringInterval] = useState<string>('7')
  const [fertilizerIntervalMonth, setFertilizerIntervalMonth] = useState<string>('12')
  const [repottingIntervalMonth, setRepottingIntervalMonth] = useState<string>('12')
  const [adoptedDate, setAdoptedDate] = useState<Date>(() => new Date(plant.adoptedAt))
  const [lastWateredDate, setLastWateredDate] = useState<Date>(() =>
    plant.lastWateredAt ? new Date(plant.lastWateredAt) : new Date()
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [removeImage, setRemoveImage] = useState(false)

  // 모달 열릴 때 설정 탭 상태 초기화
  useEffect(() => {
    if (!open) return

    const w = clamp(plant.wateringIntervalDays, 1)
    setWateringInterval(String(w))

    const fM = daysToMonths(clamp(plant.fertilizerIntervalDays, 30))
    const rM = daysToMonths(clamp(plant.repottingIntervalDays, 30))
    setFertilizerIntervalMonth(String(fM))
    setRepottingIntervalMonth(String(rM))

    setAdoptedDate(new Date(plant.adoptedAt))
    setLastWateredDate(plant.lastWateredAt ? new Date(plant.lastWateredAt) : new Date())
    setSelectedFile(null)
    setRemoveImage(false)
  }, [open, plant])

  // 변경 여부 감지
  const hasChanges = useMemo(() => {
    const initialWatering = clamp(plant.wateringIntervalDays, 1)
    const initialFertilizerMonth = daysToMonths(clamp(plant.fertilizerIntervalDays, 30))
    const initialRepottingMonth = daysToMonths(clamp(plant.repottingIntervalDays, 30))

    const wateringChanged = Number(wateringInterval) !== initialWatering
    const fertilizerChanged = Number(fertilizerIntervalMonth) !== initialFertilizerMonth
    const repottingChanged = Number(repottingIntervalMonth) !== initialRepottingMonth

    const initialAdopted = new Date(plant.adoptedAt)
    initialAdopted.setHours(0, 0, 0, 0)
    const currentAdopted = new Date(adoptedDate)
    currentAdopted.setHours(0, 0, 0, 0)
    const adoptedChanged = currentAdopted.getTime() !== initialAdopted.getTime()

    let lastWateredChanged = false
    if (!plant.lastWateredAt) {
      lastWateredChanged = true
    } else {
      const initialLast = new Date(plant.lastWateredAt)
      initialLast.setHours(0, 0, 0, 0)
      const currentLast = new Date(lastWateredDate)
      currentLast.setHours(0, 0, 0, 0)
      lastWateredChanged = currentLast.getTime() !== initialLast.getTime()
    }

    const imageChanged = !!selectedFile || removeImage

    return (
      wateringChanged ||
      fertilizerChanged ||
      repottingChanged ||
      adoptedChanged ||
      lastWateredChanged ||
      imageChanged
    )
  }, [
    plant,
    wateringInterval,
    fertilizerIntervalMonth,
    repottingIntervalMonth,
    adoptedDate,
    lastWateredDate,
    selectedFile,
    removeImage,
  ])

  return (
    <form
      id="panel-settings"
      role="tabpanel"
      aria-labelledby="tab-settings"
      className="flex flex-col relative min-h-full"
      onSubmit={(e) => {
        if (!hasChanges) {
          e.preventDefault()
          return
        }

        if (confirmOnSave && !window.confirm('변경하시겠습니까?')) {
          e.preventDefault()
          return
        }

        const wateringDays = clamp(Number(wateringInterval) || 1, 1)
        const fertilizerMonths = clamp(Number(fertilizerIntervalMonth) || 1, 1)
        const repottingMonths = clamp(Number(repottingIntervalMonth) || 1, 1)

        onSaveIntervals?.({
          wateringDays,
          fertilizerMonths,
          repottingMonths,
          adoptedAt: adoptedDate,
          lastWateredAt: lastWateredDate,
          file: selectedFile ?? null,
          removeImage,
        })

        onDone?.()
      }}
    >
      <input type="hidden" name="id" value={plant.id} />
      <input type="hidden" name="wateringInterval" value={wateringInterval} />
      <input type="hidden" name="fertilizerIntervalMonth" value={fertilizerIntervalMonth} />
      <input type="hidden" name="repottingIntervalMonth" value={repottingIntervalMonth} />
      <input type="hidden" name="adoptedAt" value={adoptedDate.toISOString()} />
      <input type="hidden" name="lastWateredAt" value={lastWateredDate.toISOString()} />
      <input type="hidden" name="removeImage" value={removeImage ? 'true' : 'false'} />

      {/* 스크롤되는 콘텐츠 영역 */}
      <div className="space-y-4 pb-4">
        <div className="space-y-2 pl-2">
          <label className="text-sm font-medium text-foreground/80">사진</label>

          <div className="p-6 rounded-lg bg-secondary/10 border border-border">
            <div className="flex flex-col items-center gap-4">
              <ImageUpload
                name="file"
                initialImageUrl={plant.coverImageUrl || plant.defaultImageUrl || null}
                onImageChange={(file) => {
                  setSelectedFile(file)
                  if (file) {
                    setRemoveImage(false)
                  } else if (plant.coverImageUrl) {
                    setRemoveImage(true)
                  } else {
                    setRemoveImage(false)
                  }
                }}
              />
              <p className="text-xs text-muted-foreground">ⓧ 버튼을 클릭해서 변경할 수 있어요</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pl-2 ">
          <DateSelect label="처음 함께한 날짜" value={adoptedDate} onChange={setAdoptedDate} />
          <DateSelect
            label="마지막 물 준 날짜"
            value={lastWateredDate}
            onChange={setLastWateredDate}
          />
        </div>

        <div className="space-y-2 pl-2">
          <label className="text-sm font-medium text-foreground/80">물주기 주기</label>
          <SelectBox
            value={wateringInterval}
            placeholder="주기 선택"
            options={DAY_MAX.map((o) => ({ ...o, label: `${o.value}일` }))}
            onSelect={setWateringInterval}
            className="py-1 w-90"
          />
        </div>

        <div className="space-y-2 pl-2">
          <label className="text-sm font-medium text-foreground/80">영양제 주기</label>
          <SelectBox
            value={fertilizerIntervalMonth}
            placeholder="주기 선택"
            options={MONTH_MAX.map((o) => ({ ...o, label: `${o.value}개월` }))}
            onSelect={setFertilizerIntervalMonth}
            className="py-1 w-90"
          />
        </div>

        <div className="space-y-2 pl-2">
          <label className="text-sm font-medium text-foreground/80">분갈이 주기</label>
          <SelectBox
            value={repottingIntervalMonth}
            placeholder="주기 선택"
            options={MONTH_MAX.map((o) => ({ ...o, label: `${o.value}개월` }))}
            onSelect={setRepottingIntervalMonth}
            className="py-1 w-90"
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-10 bg-background pt-2 pb-1 mt-auto">
        <Button className="w-full mt-2" type="submit" disabled={!hasChanges}>
          변경 사항 저장
        </Button>
      </div>
    </form>
  )
}

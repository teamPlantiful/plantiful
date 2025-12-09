import { useMemo } from 'react'
import { Calendar, Droplets, HeartPlus, Sprout } from 'lucide-react'
import Image from 'next/image'

import { CareGuideSection } from '@/components/shared/CareGuideSection'
import type { Plant, CareInfo } from '@/types/plant'
import { calculateDday, formatDate, addDays } from '@/utils/date'

interface PlantDetailStatusTabProps {
  plant: Plant
  nickname: string
}

export default function PlantDetailStatusTab({ plant, nickname }: PlantDetailStatusTabProps) {
  const ddayWater = useMemo(() => {
    if (!plant.lastWateredAt || !plant.wateringIntervalDays) return null

    const target = addDays(plant.lastWateredAt, plant.wateringIntervalDays)
    const diff = calculateDday(target)
    return diff >= 0 ? diff : 0
  }, [plant.lastWateredAt, plant.wateringIntervalDays])

  const fertilizerIntervalDays = plant.fertilizerIntervalDays
  const repottingIntervalDays = plant.repottingIntervalDays

  const PLACEHOLDER_IMAGE = 'https://placehold.co/64x64/EBF4E5/3B5935.png?text=%3F'
  const imageSrc = plant.coverImageUrl || plant.defaultImageUrl || PLACEHOLDER_IMAGE
  const imageAlt = nickname || plant.nickname || plant.koreanName || '식물 이미지'

  const careInfo: CareInfo | undefined = useMemo(() => {
    if (
      !plant.lightDemandCode &&
      !plant.waterCycleCode &&
      !plant.temperatureCode &&
      !plant.humidityCode
    ) {
      return undefined
    }
    return {
      lightDemandCode: plant.lightDemandCode ?? undefined,
      waterCycleCode: plant.waterCycleCode ?? undefined,
      temperatureCode: plant.temperatureCode ?? undefined,
      humidityCode: plant.humidityCode ?? undefined,
    }
  }, [plant.lightDemandCode, plant.waterCycleCode, plant.temperatureCode, plant.humidityCode])

  return (
    <div id="panel-status" role="tabpanel" aria-labelledby="tab-status" className="space-y-4">
      {/* 사진 */}
      <div className="flex items-center">
        <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-secondary/20 mx-auto">
          <Image src={imageSrc} alt={imageAlt} fill sizes="144px" className="object-cover" />
        </div>
      </div>
      <div className="space-y-3">
        {/* 처음 함께한 날짜 */}
        <div className="flex items-center bg-secondary/10 justify-between p-3 rounded-lg border border-border text-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-sunshine" />
            <span className="font-medium">처음 함께한 날짜</span>
          </div>
          <span className="text-sm font-semibold">
            {plant.adoptedAt ? formatDate(new Date(plant.adoptedAt)) : '-'}
          </span>
        </div>

        {/* 마지막 물 준 날짜 */}
        <div className="flex items-center bg-secondary/10 justify-between p-3 rounded-lg border border-border text-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-leaf-green" />
            <span className="font-medium">마지막 물 준 날짜</span>
          </div>
          <span className="text-sm font-semibold">
            {plant.lastWateredAt ? formatDate(new Date(plant.lastWateredAt)) : '-'}
          </span>
        </div>

        {/* 물주기 */}
        <div className="flex items-center bg-secondary/10 justify-between p-3 rounded-lg border border-border text-foreground">
          <div className="flex items-center gap-3">
            <Droplets className="h-5 w-5 text-water-blue" />
            <span className="font-medium">물주기</span>
          </div>
          <span className="text-sm font-semibold">
            {ddayWater !== null ? `D-${ddayWater}` : '-'}
          </span>
        </div>

        {/* 영양제 */}
        <div className="flex items-center bg-secondary/10 justify-between p-3 rounded-lg border border-border text-foreground">
          <div className="flex items-center gap-3">
            <HeartPlus className="h-5 w-5 text-terracotta" />
            <span className="font-medium">영양제</span>
          </div>
          <span className="text-sm font-semibold">{`D-${fertilizerIntervalDays}`}</span>
        </div>

        {/* 분갈이 */}
        <div className="flex items-center bg-secondary/10 justify-between p-3 rounded-lg border border-border text-foreground">
          <div className="flex items-center gap-3">
            <Sprout className="h-5 w-5 text-plant-healthy" />
            <span className="font-medium">분갈이</span>
          </div>
          <span className="text-sm font-semibold">{`D-${repottingIntervalDays}`}</span>
        </div>
      </div>

      {careInfo && <CareGuideSection careInfo={careInfo} />}
    </div>
  )
}

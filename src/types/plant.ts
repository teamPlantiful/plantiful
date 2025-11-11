export interface CareInfo {
  lightDemandCode?: string
  waterCycleCode?: string
  temperatureCode?: string
  humidityCode?: string
}

export interface PlantSpeciesInfo {
  cntntsNo: string
  koreanName: string
  scientificName?: string
  imageUrl?: string
  careInfo: CareInfo
}

export interface PlantData {
  species: PlantSpeciesInfo
  nickname: string
  wateringInterval: number
  fertilizerInterval: number
  repottingInterval: number
  lastWateredDate: Date
  startDate: Date
  image?: string
}

export interface PlantCardInfo {
  id: string
  nickname: string
  speciesName?: string | null
  coverImageUrl?: string | null
  defaultImageUrl?: string | null
  ddayWater: number
  onWater: (id: string) => void
  onClick: (id: string) => void
  className?: string
}

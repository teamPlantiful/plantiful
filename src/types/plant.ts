export interface CareInfo {
  sunlight: string
  waterAmount: string
  temperature: string
  humidity: string
}

export interface PlantSpeciesInfo {
  id: string
  koreanName: string
  scientificName: string
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

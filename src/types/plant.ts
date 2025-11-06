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

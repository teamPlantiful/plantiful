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

// DB 스키마에 맞는 Plant 타입
export interface Plant {
  id: string
  user_id: string
  cntnts_no: string
  korean_name: string
  scientific_name?: string | null
  default_image_url?: string | null
  cover_image_url?: string | null
  nickname: string
  watering_interval_days: number
  fertilizer_interval_days: number
  repotting_interval_days: number
  adopted_at: string
  last_watered_at: string
  next_watering_date?: string | null
  light_demand_code?: string | null
  water_cycle_code?: string | null
  temperature_code?: string | null
  humidity_code?: string | null
  created_at: string
  updated_at: string
}

export interface CareInfo {
  lightDemandCode?: string
  waterCycleCode?: string
  temperatureCode?: string
  humidityCode?: string
}

export interface PlantSpeciesInfo {
  cntntsNo: string
  commonName: string
  scientificName?: string
  imageUrl?: string
  careInfo?: CareInfo
}

export interface PlantData {
  species: PlantSpeciesInfo
  nickname: string
  wateringInterval: number
  fertilizerInterval: number
  repottingInterval: number
  lastWateredDate: Date
  startDate: Date
  image?: string // 기본 이미지 URL (API에서 제공)
  uploadedImage?: File // 사용자가 업로드한 이미지 파일
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
  userId: string
  cntntsNo: string
  commonName: string
  scientificName?: string | null
  defaultImageUrl?: string | null
  coverImageUrl?: string | null
  nickname: string
  wateringIntervalDays: number
  fertilizerIntervalDays: number
  repottingIntervalDays: number
  adoptedAt: string
  lastWateredAt: string
  nextWateringDate?: string | null
  lightDemandCode?: string | null
  waterCycleCode?: string | null
  temperatureCode?: string | null
  humidityCode?: string | null
  createdAt: string
  updatedAt: string
}
//농사로 API 검색결과 목록 아이템 타입
export interface PlantSearchResult {
  id: number
  commonName: string
  scientificName: string[]
  defaultImage?: { mediumUrl: string }
}

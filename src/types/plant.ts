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
  imageUrl?: string | null
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
  lastWateredAt?: string | null
  onWater: (id: string, nickname: string) => void
  onClick: (id: string) => void
  className?: string
}

// DB 스키마에 맞는 Plant 타입
export interface Plant {
  id: string
  userId: string
  cntntsNo: string
  koreanName: string
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

// 정렬 옵션 타입
export type SortKey = 'water' | 'name' | 'recent'

// 커서 기반 페이지네이션 결과 타입
export interface CursorPagedResult {
  items: Plant[]
  nextCursor?: string
  hasNextPage: boolean
}

/**
 * Query Keys Factory
 *
 * 사용 예시:
 * @example
 * // 특정 필터의 식물 목록
 * queryKey: queryKeys.plants.list({ search: '몬스테라' })
 *
 * // 모든 식물 목록 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
 *
 * // 모든 식물 관련 쿼리 무효화
 * queryClient.invalidateQueries({ queryKey: queryKeys.plants.all })
 */

export const queryKeys = {
  /**
   * 식물(Plants) 관련 쿼리키
   */
  plants: {
    // 모든 식물 관련 쿼리의 루트 키
    all: ['plants'] as const,

    // 식물 목록 조회
    lists: () => [...queryKeys.plants.all, 'list'] as const,
    list: (filters?: { search?: string; sortBy?: 'water' | 'name' | 'recent' }) =>
      [...queryKeys.plants.lists(), filters] as const,

    // 개별 식물 상세 조회
    details: () => [...queryKeys.plants.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.plants.details(), id] as const,
  },

  /**
   * 외부 식물 API 관련 쿼리키
   */
  plantSpecies: {
    all: ['plantSpecies'] as const,

    // 식물 종 검색
    searches: () => [...queryKeys.plantSpecies.all, 'search'] as const,
    search: (query: string, page?: number) =>
      [...queryKeys.plantSpecies.searches(), { query, page }] as const,

    // 식물 종 상세 정보
    details: () => [...queryKeys.plantSpecies.all, 'detail'] as const,
    detail: (id: string | number) => [...queryKeys.plantSpecies.details(), id] as const,
  },

  /**
   * 사용자 프로필 관련 쿼리키
   */
  profile: {
    all: ['profile'] as const,

    // 현재 사용자 프로필
    current: () => [...queryKeys.profile.all, 'current'] as const,

    // 특정 사용자 프로필
    details: () => [...queryKeys.profile.all, 'detail'] as const,
    detail: (userId: string) => [...queryKeys.profile.details(), userId] as const,
  },
} as const

/**
 * 쿼리키 타입 추출 헬퍼
 * @example
 * type PlantListKey = QueryKey<typeof queryKeys.plants.list>
 */
export type QueryKey<T extends (...args: any[]) => readonly any[]> = ReturnType<T>

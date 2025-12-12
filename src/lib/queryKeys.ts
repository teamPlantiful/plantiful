/**
 * Query Keys Factory
 *
 * 사용 예시:
 * @example
 * // 메인 무한 스크롤 - 특정 필터의 식물 목록
 * queryKey: queryKeys.plants.list({ search: '몬스테라', sortBy: 'water' })
 *
 * // 검색 무한 스크롤 - 식물 종 검색
 * queryKey: queryKeys.plantSpecies.search('몬스테라')
 *
 * // 현재 사용자 정보 조회 (/apis/me)
 * queryKey: queryKeys.user.me()
 *
 * // 모든 식물 목록 쿼리 무효화 (무한 스크롤 포함)
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

    // 식물 목록 조회 (무한 스크롤)
    lists: () => [...queryKeys.plants.all, 'list'] as const,
    list: (filters?: { search?: string; sortBy?: 'water' | 'name' | 'recent' }) =>
      [...queryKeys.plants.lists(), filters] as const,
  },

  /**
   * 외부 식물 API 관련 쿼리키
   */
  plantSpecies: {
    all: ['plantSpecies'] as const,

    // 식물 종 검색 (무한 스크롤)
    searches: () => [...queryKeys.plantSpecies.all, 'search'] as const,
    search: (query: string) => [...queryKeys.plantSpecies.searches(), query] as const,
  },

  /**
   * 사용자 관련 쿼리키
   */
  user: {
    all: ['user'] as const,

    // 현재 로그인한 사용자 정보 (/apis/me)
    me: () => [...queryKeys.user.all, 'me'] as const,
  },
} as const

/**
 * 쿼리키 타입 추출 헬퍼
 * @example
 * type PlantListKey = QueryKey<typeof queryKeys.plants.list>
 */
export type QueryKey<T extends (...args: any[]) => readonly any[]> = ReturnType<T>

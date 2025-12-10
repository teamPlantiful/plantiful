import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'

export type SortKey = 'water' | 'name' | 'recent'

interface UseGetPlantsParams {
  search?: string
  sort?: SortKey
}

export const useGetPlants = (params: UseGetPlantsParams = {}) => {
  const { search = '', sort = 'recent' } = params

  return useQuery<Plant[], Error>({
    queryKey: [...queryKeys.plants.list(), { search, sort }],
    queryFn: async () => {
      const sp = new URLSearchParams()

      const trimmed = search.trim()
      if (trimmed) sp.set('q', trimmed)
      if (sort && sort !== 'recent') sp.set('sort', sort)

      const qs = sp.toString()
      const url = qs ? `/apis/plants?${qs}` : '/apis/plants'

      const response = await fetch(url, {
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('식물 목록을 불러오는데 실패했습니다')
      }

      const data = await response.json()
      return data.plants
    },
    staleTime: 2 * 60 * 1000,
  })
}

import { useQuery } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'

export const useGetPlants = () => {
  return useQuery<Plant[], Error>({
    queryKey: queryKeys.plants.list(),
    queryFn: async () => {
      const response = await fetch('/apis/plants', {
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

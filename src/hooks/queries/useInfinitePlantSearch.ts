import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { PlantSearchResult } from '@/types/plant'
import { queryKeys } from '@/lib/queryKeys'

interface PagedPlantResult {
  items: PlantSearchResult[]
  pageNo: number
  totalPage: number
}

export function useInfinitePlantSearch(query: string, enabled: boolean = true) {
  const safeQuery = query.trim()

  return useInfiniteQuery<PagedPlantResult>({
    queryKey: queryKeys.plantSpecies.search(safeQuery),
    initialPageParam: 1,
    enabled: enabled,
    queryFn: async ({ pageParam }) => {
      const { data } = await axios.get('/apis/searchPlant', {
        params: {
          page: pageParam,
          q: safeQuery,
        },
      })

      return data
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pageNo < lastPage.totalPage) {
        return lastPage.pageNo + 1
      }
      return undefined
    },
  })
}

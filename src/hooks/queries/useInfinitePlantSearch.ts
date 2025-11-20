import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { PlantSearchResult } from '@/types/plant'

interface PagedPlantResult {
  items: PlantSearchResult[]
  pageNo: number
  totalPage: number
}

export function useInfinitePlantSearch(query: string) {
  const safeQuery = query.trim()

  return useInfiniteQuery<PagedPlantResult>({
    queryKey: ['plant-search', safeQuery],
    initialPageParam: 1,
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

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
      console.log(`Fetching page: ${pageParam}`) // 요청 로그
      const res = await axios.get('/apis/searchPlant', {
        params: {
          page: pageParam,
          q: safeQuery || undefined,
        },
      })
      return res.data as PagedPlantResult
    },

    getNextPageParam: (lastPage, allPages) => {
      // 서버에서 온 데이터 확인용 로그
      console.log('Page Check:', {
        currentPage: lastPage.pageNo,
        totalPage: lastPage.totalPage,
        hasNext: lastPage.pageNo < lastPage.totalPage,
      })

      // 다음 페이지가 있으면 +1, 없으면 undefined
      return lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined
    },
  })
}

import { useInfiniteQuery } from '@tanstack/react-query'
import axios from 'axios'
import type { NongsaroItem } from '@/types/nongsaro'

// 무한스크롤 페이지 타입
interface NongsaroPagedResult {
  items: NongsaroItem[]
  pageNo: number
  totalPage: number
}

export function useInfinitePlantSearch(query: string, chosung: string) {
  return useInfiniteQuery<NongsaroPagedResult>({
    queryKey: ['plant-search', query, chosung],
    enabled: !!query,

    initialPageParam: 1,

    queryFn: async ({ pageParam }) => {
      const res = await axios.get(
        `/apis/searchPlant?q=${query}&chosung=${chosung}&page=${pageParam}`
      )
      return res.data as NongsaroPagedResult
    },

    getNextPageParam: (lastPage) => {
      return lastPage.pageNo < lastPage.totalPage ? lastPage.pageNo + 1 : undefined
    },
  })
}

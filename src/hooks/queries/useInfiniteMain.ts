import { useInfiniteQuery } from '@tanstack/react-query'
import type { Plant } from '@/types/plant'
import axios from 'axios'

interface CursorPagedResult {
  items: Plant[]
  nextCursor?: string
  hasNextPage: boolean
}

interface UseInfiniteMainParams {
  q: string
  sort: 'water' | 'name' | 'recent'
}

const fetchPlants = async ({
  pageParam,
  q,
  sort,
}: {
  pageParam?: string
  q: string
  sort: string
}): Promise<CursorPagedResult> => {
  const { data } = await axios.get('/apis/plants', {
    params: {
      cursor: pageParam,
      limit: 10,
      q: q.trim(),
      sort: sort,
    },
  })
  return data
}

export function useInfiniteMain({ q, sort }: UseInfiniteMainParams) {
  return useInfiniteQuery<CursorPagedResult>({
    queryKey: ['plants-main', { q: q.trim(), sort }],
    initialPageParam: undefined,

    queryFn: ({ pageParam }) =>
      fetchPlants({ pageParam: pageParam as string | undefined, q, sort }),

    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor
    },
  })
}

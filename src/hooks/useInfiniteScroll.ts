import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

interface UseInfiniteScrollProps {
  hasNextPage: boolean | undefined
  fetchNextPage: () => void
}

export const useInfiniteScroll = ({ hasNextPage, fetchNextPage }: UseInfiniteScrollProps) => {
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '200px',
  })

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return ref
}

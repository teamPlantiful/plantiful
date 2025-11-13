import { useQuery } from '@tanstack/react-query'
import { getPlants } from '@/app/apis/supabaseApi'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'

export const useGetPlants = () => {
  return useQuery<Plant[], Error>({
    queryKey: queryKeys.plants.list(),
    queryFn: getPlants,
    staleTime: 2 * 60 * 1000,
  })
}

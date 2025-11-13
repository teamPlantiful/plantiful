import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addCard } from '@/app/apis/supabaseApi'
import { queryKeys } from '@/lib/queryKeys'
import type { PlantData, Plant } from '@/types/plant'

export const useAddPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, PlantData>({
    mutationFn: addCard,
    onSuccess: () => {
      // 식물 목록 쿼리 무효화하여 자동 리페치
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },
  })
}

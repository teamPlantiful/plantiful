import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Plant } from '@/types/plant'
import { queryKeys } from '@/lib/queryKeys'
import { deletePlant } from '@/app/apis/supabaseApi'

export const useDeletePlant = () => {
  const queryClient = useQueryClient()

  return useMutation<string, Error, string>({
    mutationFn: (id) => deletePlant(id),

    onSuccess: (deletedId) => {
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.filter((p) => p.id !== deletedId)
      )
    },
  })
}

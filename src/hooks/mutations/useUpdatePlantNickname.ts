import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { Plant } from '@/types/plant'
import { queryKeys } from '@/lib/queryKeys'
import { updatePlantNicknameAction } from '@/app/actions/plant/updatePlantNicknameAction'
interface UpdateNicknameVariables {
  id: string
  nickname: string
}

export const useUpdatePlantNickname = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, UpdateNicknameVariables>({
    mutationFn: updatePlantNicknameAction,

    onSuccess: (updatedPlant) => {
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((p) => (p.id === updatedPlant.id ? updatedPlant : p))
      )
    },
  })
}

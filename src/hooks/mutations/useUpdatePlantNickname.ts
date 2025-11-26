import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updatePlantNicknameAction } from '@/app/actions/plant/updatePlantNicknameAction'
import type { Plant } from '@/types/plant'

interface UpdateNicknameVariables {
  id: string
  nickname: string
}

interface UpdateNicknameContext {
  previousPlants?: Plant[]
}

export const useUpdatePlantNickname = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateNicknameVariables, UpdateNicknameContext>({
    mutationFn: async ({ id, nickname }) => {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('nickname', nickname)
      await updatePlantNicknameAction(formData)
    },

    onMutate: async ({ id, nickname }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.list() })

      const previousPlants = queryClient.getQueryData<Plant[]>(queryKeys.plants.list())

      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.map((p) => (p.id === id ? { ...p, nickname } : p))
      )

      return { previousPlants }
    },

    onError: (error, _vars, context) => {
      console.error('닉네임 수정 실패:', error)
      if (context?.previousPlants) {
        queryClient.setQueryData(queryKeys.plants.list(), context.previousPlants)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}

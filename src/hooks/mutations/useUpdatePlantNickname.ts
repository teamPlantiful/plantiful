import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updatePlantNicknameAction } from '@/app/actions/plant/updatePlantNicknameAction'

interface UpdateNicknameVariables {
  id: string
  nickname: string
}

export const useUpdatePlantNickname = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, UpdateNicknameVariables>({
    mutationFn: async ({ id, nickname }) => {
      const formData = new FormData()
      formData.set('id', id)
      formData.set('nickname', nickname)
      await updatePlantNicknameAction(formData)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}

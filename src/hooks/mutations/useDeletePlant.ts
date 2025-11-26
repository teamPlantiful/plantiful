import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { deletePlantAction } from '@/app/actions/plant/deletePlantAction'

interface DeletePlantVariables {
  id: string
}

export const useDeletePlant = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeletePlantVariables>({
    mutationFn: async ({ id }) => {
      const formData = new FormData()
      formData.set('id', id)
      await deletePlantAction(formData)
    },

    onSuccess: () => {
      // 삭제 후 전체 목록 다시 가져오기
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}

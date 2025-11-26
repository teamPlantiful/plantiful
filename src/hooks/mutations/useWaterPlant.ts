import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updateWaterPlantAction } from '@/app/actions/plant/updateWaterPlantAction'

interface WaterPlantVariables {
  id: string
}

export const useWaterPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, WaterPlantVariables>({
    mutationFn: async ({ id }) => {
      const formData = new FormData()
      formData.set('id', id)
      await updateWaterPlantAction(formData)
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },

    onError: (error) => {
      console.error('물주기 실패:', error)
    },
  })
}

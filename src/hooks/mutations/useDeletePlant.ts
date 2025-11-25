import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { Plant } from '@/types/plant'
import { deletePlantAction } from '@/app/actions/plant/deletePlantAction'

interface DeletePlantVariables {
  id: string
}

interface DeletePlantContext {
  previousPlants?: Plant[]
}

export const useDeletePlant = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, DeletePlantVariables, DeletePlantContext>({
    mutationFn: async ({ id }) => {
      const formData = new FormData()
      formData.set('id', id)
      await deletePlantAction(formData)
    },

    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.list() })

      const previousPlants = queryClient.getQueryData<Plant[]>(queryKeys.plants.list())

      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (prev = []) =>
        prev.filter((p) => p.id !== id)
      )

      return { previousPlants }
    },

    onError: (error, _variables, context) => {
      console.error('삭제 실패:', error)
      if (context?.previousPlants) {
        queryClient.setQueryData(queryKeys.plants.list(), context.previousPlants)
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}

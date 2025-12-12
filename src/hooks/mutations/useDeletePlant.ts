import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { deletePlantAction } from '@/app/actions/plant/deletePlantAction'
import type { CursorPagedResult } from '@/types/plant'

interface DeletePlantVariables {
  id: string
}

interface DeletePlantContext {
  previousData?: InfiniteData<CursorPagedResult>
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
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.lists() })

      // 이전 데이터 저장 (롤백용)
      const previousData = queryClient.getQueryData<InfiniteData<CursorPagedResult>>(
        queryKeys.plants.lists()
      )

      // 무한 쿼리 캐시 낙관적 업데이트
      queryClient.setQueriesData<InfiniteData<CursorPagedResult>>(
        { queryKey: queryKeys.plants.lists() },
        (old) => {
          if (!old) return old

          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.filter((plant) => plant.id !== id),
            })),
          }
        }
      )

      return { previousData }
    },

    onError: (_error, _variables, context) => {
      // 에러 시 이전 데이터로 롤백
      if (context?.previousData) {
        queryClient.setQueriesData(
          { queryKey: queryKeys.plants.lists() },
          context.previousData
        )
      }
    },

    onSettled: () => {
      // stale 표시만 (즉시 refetch 안 함, 다음 포커스/마운트 시 동기화)
      queryClient.invalidateQueries({
        queryKey: queryKeys.plants.lists(),
        refetchType: 'none',
      })
    },
  })
}

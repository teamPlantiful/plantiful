import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { deletePlantAction } from '@/app/actions/plant/deletePlantAction'
import type { CursorPagedResult } from '@/types/plant'
import { toast } from '@/store/useToastStore'
import { notifyInApp } from '@/utils/notifyInApp'
import type { NotificationEvent } from '@/types/notification'

interface DeletePlantVariables {
  id: string
  nickname?: string
}

interface DeletePlantContext {
  previousQueries: [any, InfiniteData<CursorPagedResult> | undefined][]
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

      // 모든 매칭되는 쿼리의 이전 데이터 저장 (롤백용)
      const previousQueries = queryClient.getQueriesData<InfiniteData<CursorPagedResult>>({
        queryKey: queryKeys.plants.lists(),
      })

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

      return { previousQueries }
    },

    onSuccess: (_data, variables) => {
      const nickname = variables.nickname ?? '식물'

      // 인앱 알림 + 토스
      notifyInApp({
        title: `${nickname} 삭제 완료 🗑️`,
        body: '해당 식물과 관련된 기록이 삭제되었어요.',
        toastMessage: `${nickname} 삭제 완료`,
        toastType: 'success',
        event: 'PLANT_DELETED' as NotificationEvent,
        plantId: variables.id,
      })
      // 서버 데이터로 즉시 refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },

    onError: (error, _variables, context) => {
      console.error('식물 삭제 실패:', error)
      toast('식물 삭제에 실패했습니다.', 'error')
      // 에러 시 이전 데이터로 롤백
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          if (data) {
            queryClient.setQueryData(queryKey, data)
          }
        })
      }
    },
  })
}

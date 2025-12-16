import { useMutation, useQueryClient, InfiniteData } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import { updatePlantNicknameAction } from '@/app/actions/plant/updatePlantNicknameAction'
import type { CursorPagedResult } from '@/types/plant'
import { toast } from '@/store/useToastStore'
import { notifyInApp } from '@/utils/notifyInApp'
import type { NotificationEvent } from '@/types/notification'
interface UpdateNicknameVariables {
  id: string
  nickname: string
}

interface UpdateNicknameContext {
  previousQueries: [any, InfiniteData<CursorPagedResult> | undefined][]
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
              items: page.items.map((plant) => (plant.id === id ? { ...plant, nickname } : plant)),
            })),
          }
        }
      )

      return { previousQueries }
    },

    onSuccess: (_data, variables) => {
      const nickname = variables.nickname

      notifyInApp({
        title: '식물 이름 수정 완료 ✏️',
        body: `이제 "${nickname}" 이름으로 기록할게요.`,
        toastMessage: '식물 이름을 수정했어요.',
        toastType: 'success',
        event: 'NICKNAME_UPDATED' satisfies NotificationEvent,
        plantId: variables.id,
      })
      // 서버 데이터로 즉시 refetch
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.lists() })
    },

    onError: (error, _vars, context) => {
      console.error('닉네임 수정 실패:', error)
      toast('닉네임 수정에 실패했습니다.', 'error')
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

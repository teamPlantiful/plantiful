import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { PlantData, Plant } from '@/types/plant'

interface MutationContext {
  previousPlants?: Plant[]
  tempImageUrl?: string
}

export const useAddPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, PlantData, MutationContext>({
    mutationFn: async (plantData: PlantData) => {
      const formData = new FormData()

      // 파일이 있으면 추가
      if (plantData.uploadedImage) {
        formData.append('file', plantData.uploadedImage)
      }

      // 나머지 데이터를 JSON으로 추가 (Date를 ISO string으로 변환)
      const { uploadedImage, lastWateredDate, startDate, ...rest } = plantData
      const dataToSend = {
        ...rest,
        lastWateredDate: lastWateredDate.toISOString(),
        startDate: startDate.toISOString(),
      }
      formData.append('data', JSON.stringify(dataToSend))

      const response = await fetch('/apis/plants', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('식물 등록에 실패했습니다')
      }

      return response.json()
    },
    onMutate: async (newPlant) => {
      // 진행 중인 리페치 취소
      await queryClient.cancelQueries({ queryKey: queryKeys.plants.list() })

      // 이전 데이터 백업
      const previousPlants = queryClient.getQueryData<Plant[]>(queryKeys.plants.list())

      // 임시 이미지 URL 생성 (사용자가 업로드한 파일)
      const tempImageUrl = newPlant.uploadedImage
        ? URL.createObjectURL(newPlant.uploadedImage)
        : newPlant.image || ''

      // 임시 Plant 객체 생성
      const tempPlant: Plant = {
        id: 'temp-' + Date.now(),
        userId: 'temp',
        cntntsNo: newPlant.species.cntntsNo,
        koreanName: newPlant.species.koreanName,
        scientificName: newPlant.species.scientificName || null,
        defaultImageUrl: newPlant.image || null,
        coverImageUrl: tempImageUrl,
        nickname: newPlant.nickname || newPlant.species.koreanName,
        wateringIntervalDays: newPlant.wateringInterval,
        fertilizerIntervalDays: newPlant.fertilizerInterval,
        repottingIntervalDays: newPlant.repottingInterval,
        adoptedAt: newPlant.startDate.toISOString(),
        lastWateredAt: newPlant.lastWateredDate.toISOString(),
        nextWateringDate: new Date(
          newPlant.lastWateredDate.getTime() + newPlant.wateringInterval * 24 * 60 * 60 * 1000
        ).toISOString(),
        lightDemandCode: newPlant.species.careInfo?.lightDemandCode || null,
        waterCycleCode: newPlant.species.careInfo?.waterCycleCode || null,
        temperatureCode: newPlant.species.careInfo?.temperatureCode || null,
        humidityCode: newPlant.species.careInfo?.humidityCode || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // 임시 데이터 즉시 추가 (최신 등록순이므로 맨 앞에)
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (old = []) => [tempPlant, ...old])

      // 롤백을 위해 이전 데이터 반환
      return { previousPlants, tempImageUrl }
    },
    onError: (_err, _newPlant, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previousPlants) {
        queryClient.setQueryData(queryKeys.plants.list(), context.previousPlants)
      }
      // 임시 이미지 URL 정리
      if (context?.tempImageUrl && context.tempImageUrl.startsWith('blob:')) {
        URL.revokeObjectURL(context.tempImageUrl)
      }
    },
    onSuccess: (data, _variables, context) => {
      // 1단계: 먼저 blob URL 유지하면서 ID 업데이트 (즉시 반응)
      queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (old = []) => {
        return old.map((plant) => {
          if (plant.id.startsWith('temp-')) {
            return {
              ...data,
              coverImageUrl: plant.coverImageUrl, // blob URL 유지
            }
          }
          return plant
        })
      })

      // 2단계: 서버 이미지가 있으면 preload 후 교체
      if (data.coverImageUrl && context?.tempImageUrl) {
        const img = new Image()
        img.onload = () => {
          // 이미지 캐시 완료 후 서버 URL로 교체
          setTimeout(() => {
            queryClient.setQueryData<Plant[]>(queryKeys.plants.list(), (old = []) => {
              return old.map((plant) => {
                if (plant.id === data.id) {
                  return data
                }
                return plant
              })
            })

            // blob URL 정리
            if (context?.tempImageUrl?.startsWith('blob:')) {
              URL.revokeObjectURL(context.tempImageUrl)
            }
          }, 500)
        }
        img.src = data.coverImageUrl
      }
    },
  })
}

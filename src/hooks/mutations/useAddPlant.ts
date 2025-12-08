import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/lib/queryKeys'
import type { PlantData, Plant } from '@/types/plant'
import addPlantAction from '@/app/actions/plant/addPlantAction'

export const useAddPlant = () => {
  const queryClient = useQueryClient()

  return useMutation<Plant, Error, PlantData>({
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

      // Server Action 호출
      return await addPlantAction(formData)
    },
    onSettled: () => {
      // 성공/실패 관계없이 서버 데이터 새로고침
      queryClient.invalidateQueries({ queryKey: queryKeys.plants.list() })
    },
  })
}

'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import { clamp, monthsToDays } from '@/utils/generateDay'
import { addDays, toDateOnlyISO } from '@/utils/date'

const STORAGE_BUCKET = 'plant-images'

export async function updatePlantAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')
  const wateringInterval = Number(formData.get('wateringInterval') ?? 0)
  const fertilizerIntervalMonth = Number(formData.get('fertilizerIntervalMonth') ?? 0)
  const repottingIntervalMonth = Number(formData.get('repottingIntervalMonth') ?? 0)
  const adoptedAtRaw = formData.get('adoptedAt') as string | null
  const lastWateredAtRaw = formData.get('lastWateredAt') as string | null
  const file = formData.get('file') as File | null
  const removeImageRaw = formData.get('removeImage')
  const removeImage = removeImageRaw === 'true'

  const wateringDays = clamp(wateringInterval || 1, 1)
  const fertilizerDays = monthsToDays(clamp(fertilizerIntervalMonth || 1, 1))
  const repottingDays = monthsToDays(clamp(repottingIntervalMonth || 1, 1))

  const { supabase, user } = await requireAuth()

  const updatePayload: Record<string, unknown> = {
    watering_interval_days: wateringDays,
    fertilizer_interval_days: fertilizerDays,
    repotting_interval_days: repottingDays,
  }

  if (typeof adoptedAtRaw === 'string' && adoptedAtRaw) {
    updatePayload.adopted_at = adoptedAtRaw
  }

  if (typeof lastWateredAtRaw === 'string' && lastWateredAtRaw) {
    updatePayload.last_watered_at = lastWateredAtRaw

    const nextDate = addDays(lastWateredAtRaw, wateringDays)
    updatePayload.next_watering_date = toDateOnlyISO(nextDate)
  }

  if (removeImage) {
    updatePayload.cover_image_url = null
  }

  if (!removeImage && file && file.size > 0) {
    const ext = file.name.split('.').pop() || 'jpg'
    const filePath = `${user.id}/${id}-${Date.now()}.${ext}`

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        upsert: true,
      })

    if (uploadError || !uploadData) {
      throw new Error(uploadError?.message ?? '이미지 업로드에 실패했습니다.')
    }

    const { data: publicUrlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(uploadData.path)

    if (publicUrlData?.publicUrl) {
      updatePayload.cover_image_url = publicUrlData.publicUrl
    }
  }

  console.log('incoming lastWateredAtRaw:', lastWateredAtRaw)

  const { error } = await supabase
    .from('plants')
    .update(updatePayload)
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message ?? '식물 정보 변경에 실패했습니다.')
  }

  const { data: after } = await supabase
    .from('plants')
    .select('last_watered_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  console.log('saved last_watered_at:', after?.last_watered_at)
}

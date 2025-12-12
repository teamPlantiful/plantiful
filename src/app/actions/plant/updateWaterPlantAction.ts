'use server'

import { requireAuth } from '@/utils/supabase/helpers'

export async function updateWaterPlantAction(formData: FormData): Promise<void> {
  const id = String(formData.get('id') ?? '')

  if (!id) {
    throw new Error('잘못된 요청입니다.')
  }

  const { supabase, user } = await requireAuth()

  // 1) 현재 식물의 마지막 물준 날짜 조회
  const { data: plant, error: fetchError } = await supabase
    .from('plants')
    .select('last_watered_at, nickname')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !plant) {
    throw new Error('식물 정보를 찾을 수 없습니다.')
  }

  const now = new Date()
  const last = plant.last_watered_at ? new Date(plant.last_watered_at) : null

  const isSameDay =
    last &&
    last.getFullYear() === now.getFullYear() &&
    last.getMonth() === now.getMonth() &&
    last.getDate() === now.getDate()

  if (isSameDay) {
    return
  }

  // 2) 오늘 처음 물 주는 경우에만 업데이트
  const { error: updateError } = await supabase
    .from('plants')
    .update({ last_watered_at: now.toISOString() })
    .eq('id', id)
    .eq('user_id', user.id)

  if (updateError) {
    throw new Error(updateError.message ?? '물주기 업데이트에 실패했습니다.')
  }
  // 3) 알림 저장
  const title = `${plant.nickname ?? '식물'} 물주기 완료 💧`
  const body = '오늘 물을 줬어요.'

  const { error: notifError } = await supabase.from('notifications').insert({
    user_id: user.id,
    title,
    body,
    type: 'success',
    source: 'local',
    data: {
      plantId: id,
      event: 'WATERED',
    },
  })

  if (notifError) {
    console.error('[notifications insert error]', notifError)
    throw new Error(notifError.message ?? '알림 저장에 실패했습니다.')
  }

  //revalidatePath('/')
}

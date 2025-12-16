'use server'

import { requireAuth } from '@/utils/supabase/helpers'

//개별 알림 읽음 처리
export async function NotificationReadAction(id: string) {
  const { supabase, user } = await requireAuth()

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('[markNotificationReadAction] error', error)
    throw new Error(error.message ?? '알림 읽음 처리에 실패했습니다.')
  }
}

//해당 유저의 모든 알림 읽음 처리
export async function AllNotificationsReadAction() {
  const { supabase, user } = await requireAuth()

  const { error } = await supabase
    .from('notifications')
    .update({
      is_read: true,
      read_at: new Date().toISOString(),
    })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) {
    console.error('[markAllNotificationsReadAction] error', error)
    throw new Error(error.message ?? '알림 전체 읽음 처리에 실패했습니다.')
  }
}

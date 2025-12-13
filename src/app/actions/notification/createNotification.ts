'use server'

import { requireAuth } from '@/utils/supabase/helpers'
import type { NotificationEvent } from '@/types/notification'

interface CreateNotificationInput {
  id: string
  title: string
  body?: string
  type?: 'success' | 'info' | 'warning' | 'error'
  source?: 'local' | 'fcm'
  data?: {
    event: NotificationEvent
    plantId?: string
    [key: string]: string | undefined
  }
}

export async function createNotification({
  id,
  title,
  body,
  type = 'info',
  source = 'local',
  data,
}: CreateNotificationInput) {
  const { supabase, user } = await requireAuth()

  const { error } = await supabase.from('notifications').insert({
    id,
    user_id: user.id,
    title,
    body,
    type,
    source,
    data,
  })

  if (error) {
    console.error('[createNotification] error', error)
    throw new Error('알림 생성에 실패했습니다.')
  }
}

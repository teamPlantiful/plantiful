'use client'

import { createNotification } from '@/app/actions/notification/createNotification'
import { useNotificationStore } from '@/store/useNotificationStore'
import { toast } from '@/store/useToastStore'
import type { NotificationEvent } from '@/types/notification'

interface NotifyOptions {
  title: string
  body?: string
  toastMessage?: string
  toastType?: 'default' | 'success' | 'error' | 'info'
  event: NotificationEvent
  plantId?: string
}

export function notifyInApp({
  title,
  body,
  toastMessage,
  toastType = 'info',
  event,
  plantId,
}: NotifyOptions) {
  const addNotification = useNotificationStore.getState().addNotification

  const id = crypto.randomUUID()

  // 1) 알림 센터에 추가
  addNotification({
    id,
    title,
    body,
    source: 'local',
    data: {
      event,
      ...(plantId ? { plantId } : {}),
    },
  })

  void createNotification({
    id,
    title,
    body,
    type: toastType === 'error' ? 'error' : 'success',
    source: 'local',
    data: {
      event,
      ...(plantId ? { plantId } : {}),
    },
  })

  // 2) 토스트
  if (toastMessage) {
    toast(toastMessage, toastType)
  }
}

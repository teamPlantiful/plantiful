'use client'

import { useEffect } from 'react'
import { subscribeForegroundMessages } from '@/utils/firebase/firebaseClient'
import { useNotificationStore } from '@/store/useNotificationStore'
import { toast } from '@/store/useToastStore'

export default function FcmInAppListener() {
  const addNotification = useNotificationStore((s) => s.addNotification)

  useEffect(() => {
    subscribeForegroundMessages((payload) => {
      console.log('FCM foreground message:', payload)

      const title = payload.notification?.title ?? '알림'
      const body = payload.notification?.body ?? ''

      addNotification({
        title,
        body,
        source: 'fcm',
        data: (payload.data ?? undefined) as Record<string, string> | undefined,
      })

      toast(body ? `${title} · ${body}` : title, 'info')
    })
  }, [addNotification])

  return null
}

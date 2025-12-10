'use client'

import { useEffect } from 'react'
import { subscribeForegroundMessages } from '@/utils/firebase/firebaseClient'

export default function FcmInAppListener() {
  useEffect(() => {
    subscribeForegroundMessages((payload) => {
      console.log('🔔 FCM foreground message:', payload)

      const title = payload.notification?.title ?? '알림'
      const body = payload.notification?.body ?? ''

      alert(`${title}\n${body}`)
    })
  }, [])

  return null
}

'use client'

import { useEffect } from 'react'
import { subscribeForegroundMessages } from '@/utils/firebaseClient'

export default function FcmInAppListener() {
  useEffect(() => {
    let cancelled = false

    async function setup() {
      await subscribeForegroundMessages((payload) => {
        if (cancelled) return

        console.log('FCM foreground message:', payload)

        const title = payload.notification?.title ?? '알림'
        const body = payload.notification?.body ?? ''

        alert(`${title}\n${body}`)
      })
    }

    setup()

    return () => {
      cancelled = true
    }
  }, [])

  return null
}

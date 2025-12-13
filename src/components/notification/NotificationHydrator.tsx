'use client'

import { useEffect, useRef } from 'react'
import { useNotificationStore, type AppNotification } from '@/store/useNotificationStore'

interface Props {
  initialNotifications: AppNotification[]
}

export default function NotificationHydrator({ initialNotifications }: Props) {
  const hydratedRef = useRef(false)
  const setNotifications = useNotificationStore((s) => s.setNotifications)

  useEffect(() => {
    if (hydratedRef.current) return
    hydratedRef.current = true

    setNotifications(initialNotifications)
  }, [initialNotifications, setNotifications])

  return null
}

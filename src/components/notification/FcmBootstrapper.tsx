'use client'

import { useFcmRegistration } from '@/hooks/useFcmRegistration'

export default function FcmBootstrapper() {
  const { token, error } = useFcmRegistration()

  if (error) {
    console.error('FCM registration error:', error)
  } else if (token) {
    console.log('FCM registered token:', token)
  }

  return null
}

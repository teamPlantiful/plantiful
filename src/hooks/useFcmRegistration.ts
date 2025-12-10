'use client'

import { useEffect, useState } from 'react'
import { requestFcmToken } from '@/utils/firebaseClient'

interface UseFcmRegistrationResult {
  token: string | null
  loading: boolean
  error: string | null
}

export function useFcmRegistration(): UseFcmRegistrationResult {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function register() {
      try {
        setLoading(true)

        // 1) 브라우저에서 FCM 토큰 발급
        const t = await requestFcmToken()
        if (!t) {
          if (!cancelled) {
            setError('토큰 발급 실패 또는 권한 거부')
          }
          return
        }

        if (!cancelled) {
          setToken(t)
        }

        // 2) 서버에 토큰 저장
        const res = await fetch('/apis/push-tokens', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token: t,
            platform: navigator.platform,
            userAgent: navigator.userAgent,
          }),
        })

        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || 'push token 저장 실패')
        }
      } catch (e: any) {
        console.error('[useFcmRegistration] error:', e)
        if (!cancelled) {
          setError(e.message ?? 'FCM 등록 중 오류')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    register()

    return () => {
      cancelled = true
    }
  }, [])

  return { token, loading, error }
}

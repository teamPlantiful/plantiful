'use client'

import { useEffect } from 'react'
import { supabase } from '@/app/apis/supabaseClient'
import { useAuthStore } from '@/store/useAuthStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, setLoading } = useAuthStore()

  // 초기 세션 확인 및 auth 상태 변화 감지
  useEffect(() => {
    // 초기 세션 가져오기
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setSession(session ?? null)
      setLoading(false)
    })

    // auth 상태 변화 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession, setLoading])

  return <>{children}</>
}

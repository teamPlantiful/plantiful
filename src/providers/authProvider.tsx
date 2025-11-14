'use client'

import { useEffect } from 'react'
import { supabase } from '@/app/apis/supabaseClient'
import { useAuthStore } from '@/store/useAuthStore'
import type { Session } from '@supabase/supabase-js'

export function AuthProvider({
  children,
  initialSession,
}: {
  children: React.ReactNode
  initialSession: Session | null
}) {
  const { setUser, setSession, setLoading } = useAuthStore()

  // 초기 세션 설정
  useEffect(() => {
    setUser(initialSession?.user ?? null)
    setSession(initialSession ?? null)
    setLoading(false)
  }, [initialSession, setUser, setSession, setLoading])

  // auth 상태 변화 감지
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setSession(session ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser, setSession])

  return <>{children}</>
}

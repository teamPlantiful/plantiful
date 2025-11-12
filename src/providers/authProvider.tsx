'use client';

import { useEffect } from 'react';
import { supabase } from '@/app/apis/supabaseClient';
import { useAuthStore } from '@/store/useAuthStore';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setSession, checkSession } = useAuthStore();

  useEffect(() => {
    // 새로고침 시 세션 복구
    checkSession();

    // 슈퍼베이스와 연동해 로그인 / 로그아웃 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession, checkSession]);

  return <>{children}</>;
}
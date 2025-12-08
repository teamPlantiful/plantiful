'use server'

import { createClient } from '@/utils/supabase/server'

export async function logout() {
  const supabase = await createClient()
  // 서버 클라이언트에서 로그아웃 시도
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: "로그아웃 중 문제가 발생했습니다." }
  }

  // 로그아웃 반환
  return { success: true }
}
import { createClient } from './server'

/**
 * 인증된 사용자를 요구하는 헬퍼 함수
 * 인증되지 않은 경우 에러를 throw
 */
export async function requireAuth() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    throw new Error('Unauthorized: 사용자 정보를 불러올 수 없습니다.')
  }

  return { user, supabase }
}

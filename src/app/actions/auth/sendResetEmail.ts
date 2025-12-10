'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'

export async function sendResetEmail(formData: FormData) {
  // 폼에서 입력한 이메일 받아오기
  const email = formData.get('email') as string

  // 헤더를 통해 진입 도메인 지정
  const requestHeaders = await headers()
  const origin = requestHeaders.get("origin")  // 인증 요청 도메인
  const callbackUrl = `${origin}/apis/account/callback`

  // 서버 측 클라이언트 생성 후, 인증 메일 발송
  const supabase = await createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  })

  if (error) {
    return { error: "이메일 인증 중 오류가 발생했습니다." }
  }
  
  // 발송 완료되었을 경우, 성공 메세지 출력
  return { success: "비밀번호 재설정 링크가 발송되었습니다!"}
}
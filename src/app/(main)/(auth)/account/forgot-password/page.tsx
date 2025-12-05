import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'

export default async function ForgotPasswordPage() {
  const supabase = await createClient()
  // 서버 클라이언트 통해 유저 정보 불러옴
  const { data: { user }} = await supabase.auth.getUser()

  // 이미 로그인 상태면 메인 페이지로 리다이렉트
  if (user) {
    redirect('/')
  }
  
  // 로그인 안 되어 있으면 비밀번호 찾기 페이지 불러옴
  return <ForgotPasswordForm />
}
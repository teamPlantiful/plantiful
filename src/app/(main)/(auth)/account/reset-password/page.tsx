import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default async function ResetPasswordPage() {
  // 부여한 쿠키를 가진 사람만 비밀번호 변경 페이지 진입 가능하게 설정
  const cookieStore = await cookies()
  const resetFlag = cookieStore.get('reset_flow')?.value

  // 쿠키가 없다, 메인으로 튕궈 냄.
  if (!resetFlag) {
    redirect('/')
  }
  
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // 쿠키는 있는데 세션이 없을 경우(인증 시간 초과), 인증 만료 페이지로
  if (!user) {
    redirect('/authError')
  } 

  return <ResetPasswordForm />
}
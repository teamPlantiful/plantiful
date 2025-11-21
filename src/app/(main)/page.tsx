import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import DashboardClient from './dashboard-client'
import { Suspense } from 'react'

export default async function Home() {
  const supabase = await createClient()
  // Supabase 서버에서 클라이언트 생성 후 데이터를 토대로 유저 정보를 가져옴.
  const { data: { user } } = await supabase.auth.getUser()
  
  // 만약 유저 정보가 없으면 로그인 화면으로
  if (!user) {
    redirect('/login')
  }

  // 유저 정보가 있다면 컨텐츠 표시
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <DashboardClient />
      </Suspense>
    </>
  )
}

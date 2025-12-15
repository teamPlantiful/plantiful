import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import Header from '@/components/Header'
import DashboardClient from './dashboard-client'
import { Suspense } from 'react'

import FcmBootstrapper from '@/components/notification/FcmBootstrapper'
import FcmInAppListener from '@/components/notification/FcmInAppListener'
import NotificationHydrator from '@/components/notification/NotificationHydrator'
import { AppNotification } from '@/types/notification'

export default async function Home() {
  const supabase = await createClient()
  // Supabase 서버에서 클라이언트 생성 후 데이터를 토대로 유저 정보를 가져옴.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // DB에서 내 알림 목록 가져오기
  const { data: rows } = await supabase
    .from('notifications')
    .select('id, title, body, created_at, is_read, source, data')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // zustand에서 쓰는 형태로 변환
  const initialNotifications: AppNotification[] =
    rows?.map((row) => ({
      id: row.id,
      title: row.title,
      body: row.body ?? undefined,
      createdAt: row.created_at,
      read: row.is_read,
      source: (row.source as 'local' | 'fcm') ?? 'local',
      data: (row.data as Record<string, string> | null) ?? undefined,
    })) ?? []

  return (
    <>
      <Header />
      <NotificationHydrator initialNotifications={initialNotifications} />
      <FcmBootstrapper />
      <FcmInAppListener />
      <Suspense fallback={null}>
        <DashboardClient />
      </Suspense>
    </>
  )
}

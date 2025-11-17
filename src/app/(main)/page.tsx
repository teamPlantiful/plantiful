import { HydrationBoundary, QueryClient, dehydrate } from '@tanstack/react-query'
import { createClient } from '@/utils/supabase/server'
import { fromDbFormat } from '@/utils/plant'
import { queryKeys } from '@/lib/queryKeys'
import Header from '@/components/Header'
import DashboardClient from './dashboard-client'
import type { Plant } from '@/types/plant'

export default async function Home() {
  const queryClient = new QueryClient()
  const supabase = await createClient()

  // Middleware가 인증을 보장하므로 user는 항상 존재 user.id를 얻기 위해 getUser() 호출
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 서버에서 식물 목록 prefetch
  await queryClient.prefetchQuery({
    queryKey: queryKeys.plants.list(),
    queryFn: async (): Promise<Plant[]> => {
      // 식물 목록 조회
      const { data, error } = await supabase
        .from('plants')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Failed to fetch plants:', error)
        return []
      }

      return data.map(fromDbFormat)
    },
  })

  return (
    <>
      <Header />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DashboardClient />
      </HydrationBoundary>
    </>
  )
}

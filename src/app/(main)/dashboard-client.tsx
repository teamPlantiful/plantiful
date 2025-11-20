'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/utils/supabase/client'
import TodayPlantSection from '@/components/home/TodayPlantSection'
import PlantListSection from '@/components/home/PlantListSection'
import PlantFilterBar from '@/components/home/PlantFilterBar'
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab'

export default function DashboardClient() {
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'water' | 'name' | 'recent'>('water')

  const supabase = getSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    async function profiling() {
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      await fetch('/apis/auth/create-profile', { method: 'POST' })
    }

    profiling()
  }, [supabase, router])

  return (
    <div>
      <div className="max-w-180 mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection />
        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={setSearch}
          onSortChange={setSort}
        />
        <PlantListSection search={search} sort={sort} />
      </div>
      <PlantRegistrationFab />
    </div>
  )
}

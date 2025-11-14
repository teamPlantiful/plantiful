'use client';

import { useAuthStore } from '@/store/useAuthStore';
import TodayPlantSection from '@/components/home/TodayPlantSection';
import PlantListSection from '@/components/home/PlantListSection';
import PlantFilterBar from '@/components/home/PlantFilterBar';
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';


export default function DashboardClient() {
  const { user, loading } = useAuthStore();
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'water' | 'name' | 'recent'>('water');

  useEffect(() => {
    // 로그인 안 되어있으면 로그인 페이지로 이동
    if (!loading && !user) { 
      router.replace('/login'); 
    }
  }, [user, loading, router]);

  // 로딩이 끝날 때까지, 또는 user 없으면 화면 안보이게
  if (loading || !user) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p>로딩중...</p>
      </div>
    );
  }

  // 로그인 상태일 때
  return (
    <div>
      <div className="max-w-xl mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <TodayPlantSection />
        <PlantFilterBar
          search={search}
          sort={sort}
          onSearchChange={setSearch}
          onSortChange={setSort}
        />
        <PlantListSection search={search} sort={sort} />
        <PlantRegistrationFab />
      </div>
    </div>

  );
}
'use client';

import { useAuthStore } from '@/store/useAuthStore';
import TodayPlantSection from '@/components/home/TodayPlantSection';
import PlantListSection from '@/components/home/PlantListSection';
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';


export default function Dashboard() {
  const { user, loading } = useAuthStore();
  const router = useRouter();

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
        <PlantListSection />
        <PlantRegistrationFab />
      </div>
    </div>
    
  );
}
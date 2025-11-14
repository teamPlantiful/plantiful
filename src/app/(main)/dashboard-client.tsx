'use client';

import { useState } from 'react';
import TodayPlantSection from '@/components/home/TodayPlantSection';
import PlantListSection from '@/components/home/PlantListSection';
import PlantFilterBar from '@/components/home/PlantFilterBar';
import PlantRegistrationFab from '@/components/home/PlantRegistrationFab';

export default function DashboardClient() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<'water' | 'name' | 'recent'>('water');

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
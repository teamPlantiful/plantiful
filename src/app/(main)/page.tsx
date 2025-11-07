'use client'

import Header from '@/components/Header'
import { useState } from 'react'

import Input from '@/components/common/Input'
import Fab from '@/components/common/fab'
import SelectBox from '@/components/common/select-box'
import { Card, CardContent } from '@/components/common/card'
import PlantSpeciesSearchModal from '@/components/PlantSearchModal'
import { PerenualPlant } from '@/hooks/usePlantSearch'
        
import { Search } from 'lucide-react'

export default function Home() {
  const [sort, setSort] = useState('water')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handlePlantSelect = (plant: PerenualPlant | { common_name: string }) => {
    console.log('Selected plant:', plant)
    // TODO: 선택된 식물을 '내 식물' 목록에 추가하는 로직
  }
  return (
    <>
      <Header />
      <div className="max-w-xl mx-auto p-4 space-y-6 md:space-y-8 animate-fade-in">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-semibold text-foreground">오늘의식물</h2>
            <span className="text-sm text-muted-foreground">몬스테라</span>
          </div>

          <Card className="overflow-hidden rounded-(--radius-lg) border-0">
            <CardContent className="p-0">
              <div className="w-full h-80 grid place-items-center rounded-[calc(var(--radius-lg)-2px)] bg-linear-to-b from-[hsl(103_43%_92%)] to-[hsl(60_10%_98%)]">
                <span className="text-sm text-muted-foreground">3D 이미지 박스</span>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* 검색 & 정렬 */}
        <section className="space-y-2">
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="식물 이름 검색"
                leftIcon={<Search className="size-4" />}
                aria-label="식물 검색"
                className="h-11 pl-10 rounded-md"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">내 식물들</h2>
            <SelectBox
              className="w-[140px]"
              value={sort}
              placeholder="정렬"
              options={[
                { value: 'water', label: '물주기 우선' },
                { value: 'name', label: '이름순' },
                { value: 'recent', label: '최근 등록순' },
              ]}
              onSelect={setSort}
            />
          </div>
        </section>

        {/* 빈 상태  */}
        <section>
          <p className="text-center text-muted-foreground">아직 등록된 식물이 없습니다</p>
        </section>

        <Fab onClick={() => setIsModalOpen(true)} />
        <PlantSpeciesSearchModal
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onSelect={handlePlantSelect}
        />
      </div>
    </>
  )
}

'use client'

import Header from '@/components/Header'
import { useMemo, useState } from 'react'

import Input from '@/components/common/Input'
import Fab from '@/components/common/fab'
import SelectBox from '@/components/common/select-box'
import { Card, CardContent } from '@/components/common/card'
import PlantSpeciesSearchModal from '@/components/plant/search/PlantSearchModal'
import { RegisterPlantModal } from '@/components/plant/register/RegisterPlantModal'
import { PerenualPlant } from '@/hooks/usePlantSearch'
import type { PlantSpeciesInfo } from '@/types/plant'
import PlantCard from '@/components/plant/detail/PlantCard'
import { Search } from 'lucide-react'

export default function Home() {
  const [sort, setSort] = useState('water')
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false)
  const [selectedSpecies, setSelectedSpecies] = useState<PlantSpeciesInfo | null>(null)

  //테스트용=======================================
  type MyPlant = {
    id: string
    nickname: string
    species_name?: string | null
    cover_image_url?: string | null
    default_image_url?: string | null
    dday_water: number
    watering_interval_days: number
  }

  const [plants, setPlants] = useState<MyPlant[]>([
    {
      id: 'p-1',
      nickname: '몬스테라',
      species_name: 'Monstera deliciosa',
      default_image_url: '',
      dday_water: 0,
      watering_interval_days: 20,
    },
    {
      id: 'p-2',
      nickname: '스파티필름',
      species_name: 'Spathiphyllum wallisii',
      default_image_url: '',
      dday_water: 2,
      watering_interval_days: 10,
    },
    {
      id: 'p-3',
      nickname: '산세베리아',
      species_name: 'Sansevieria trifasciata',
      default_image_url: '',
      dday_water: 15,
      watering_interval_days: 30,
    },
    {
      id: 'p-4',
      nickname: '안스리움',
      species_name: 'Anthurium andraeanum',
      default_image_url: '',
      dday_water: 5,
      watering_interval_days: 12,
    },
    {
      id: 'p-5',
      nickname: '필로덴드론',
      species_name: 'Philodendron hederaceum',
      default_image_url: '',
      dday_water: 10,
      watering_interval_days: 25,
    },
  ])
  //====================================
  const sortedPlants = useMemo(() => {
    if (sort === 'name') {
      return [...plants].sort((a, b) => a.nickname.localeCompare(b.nickname))
    }
    if (sort === 'recent') {
      return [...plants]
    }
    return [...plants].sort((a, b) => a.dday_water - b.dday_water)
  }, [plants, sort])

  const handleCardClick = (id: string) => {
    const target = plants.find((p) => p.id === id)
  }

  const handleWater = (id: string) => {
    setPlants((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, dday_water: Math.max(1, Math.min(60, p.watering_interval_days || 7)) }
          : p
      )
    )
  }

  const handlePlantSelect = (plant: PerenualPlant | { common_name: string }) => {
    // PerenualPlant를 PlantSpeciesInfo로 변환
    const isPerenualPlant = 'id' in plant
    const perenualPlant = isPerenualPlant ? (plant as PerenualPlant) : null

    const plantSpecies: PlantSpeciesInfo = {
      id: perenualPlant ? String(perenualPlant.id) : Date.now().toString(),
      koreanName: plant.common_name,
      scientificName: perenualPlant?.scientific_name[0] ?? '',
      careInfo: {
        waterAmount: '적당히',
        sunlight: '밝은 간접광',
        temperature: '18-27°C',
        humidity: '50-70%',
      },
    }

    setSelectedSpecies(plantSpecies)
    setIsSearchModalOpen(false)
    setIsRegisterModalOpen(true)
  }

  const handleBackToSearch = () => {
    setIsRegisterModalOpen(false)
    setIsSearchModalOpen(true)
  }

  const handleRegister = (data: any) => {
    console.log('식물 등록:', data)
    setIsRegisterModalOpen(false)
    setSelectedSpecies(null)
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

        {sortedPlants.length === 0 ? (
          <section>
            <p className="text-center text-muted-foreground">아직 등록된 식물이 없습니다</p>
          </section>
        ) : (
          <section
            className="
            grid gap-3
            grid-cols-1
            md:grid-cols-2
          "
          >
            {sortedPlants.map((p) => (
              <PlantCard
                key={p.id}
                id={p.id}
                nickname={p.nickname}
                speciesName={p.species_name}
                coverImageUrl={p.cover_image_url}
                defaultImageUrl={p.default_image_url}
                ddayWater={p.dday_water}
                onClick={handleCardClick}
                onWater={handleWater}
                className="w-full"
              />
            ))}
          </section>
        )}

        <Fab onClick={() => setIsSearchModalOpen(true)} />
        <PlantSpeciesSearchModal
          open={isSearchModalOpen}
          onOpenChange={setIsSearchModalOpen}
          onSelect={handlePlantSelect}
        />
        <RegisterPlantModal
          open={isRegisterModalOpen}
          onOpenChange={setIsRegisterModalOpen}
          selectedSpecies={selectedSpecies}
          onRegister={handleRegister}
          onBack={handleBackToSearch}
        />
      </div>
    </>
  )
}

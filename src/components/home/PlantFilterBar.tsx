'use client'

import Input from '@/components/common/Input'
import SelectBox from '@/components/common/select-box'
import { Search } from 'lucide-react'

interface PlantFilterBarProps {
  search?: string
  sort: 'water' | 'name' | 'recent'
  onSearchChange: (value: string) => void
  onSortChange: (value: 'water' | 'name' | 'recent') => void
}

export default function PlantFilterBar({
  search = '',
  sort,
  onSearchChange,
  onSortChange,
}: PlantFilterBarProps) {
  const handleSortChange = (value: string) => {
    onSortChange(value as 'water' | 'name' | 'recent')
  }

  return (
    <section className="space-y-2">
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            placeholder="식물 이름 검색"
            leftIcon={<Search className="size-4" />}
            aria-label="식물 검색"
            className="h-11 pl-10 rounded-md"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
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
          onSelect={handleSortChange}
        />
      </div>
    </section>
  )
}

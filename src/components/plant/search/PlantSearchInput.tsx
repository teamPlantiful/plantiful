'use client'

import Input from '../../common/input'
import { Search } from 'lucide-react'

interface PlantSearchInputProps {
  value: string
  onChange: (value: string) => void
}

export default function PlantSearchInput({ value, onChange }: PlantSearchInputProps) {
  return (
    <div className="relative">
      <Input
        placeholder="식물 이름 검색"
        leftIcon={<Search className="size-4" />}
        aria-label="식물 검색"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 pl-10 rounded-md bg-card"
      />
    </div>
  )
}

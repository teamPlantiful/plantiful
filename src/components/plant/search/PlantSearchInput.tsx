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
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="식물 이름을 검색하세요"
        size="md"
        className="pl-10 bg-muted/30 border-none"
      />
    </div>
  )
}

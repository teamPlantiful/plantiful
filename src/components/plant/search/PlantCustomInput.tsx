'use client'

import Button from '@/components/common/button'
import Input from '@/components/common/input'

interface PlantCustomInputProps {
  value: string
  onChange: (value: string) => void
  onSelect: () => void
}

export default function PlantCustomInput({ value, onChange, onSelect }: PlantCustomInputProps) {
  return (
    <div className="p-4 rounded-lg border-2 border-dashed border-border bg-accent/20">
      <h3 className="font-semibold text-foreground mb-2">직접 입력</h3>
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="식물 이름 입력"
            size="md"
            className="bg-background w-full"
          />
        </div>
        <Button onClick={onSelect} disabled={!value.trim()} size="sm">
          선택
        </Button>
      </div>
    </div>
  )
}

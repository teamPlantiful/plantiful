'use client'

import { CalendarIcon } from 'lucide-react'
import Button from './common/button'
import formatDate from '@/utils/formatDate'

interface DateSelectProps {
  label: string
  value: Date
  onChange: (date: Date) => void
}

export function DateSelect({ label, value }: DateSelectProps) {
  const handleClick = () => {
    // TODO: Calendar 컴포넌트 연결 예정
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground/80">{label}</label>
      <Button
        variant="ghost"
        onClick={handleClick}
        className="w-full flex items-center justify-between gap-2 px-3 py-2 text-muted-foreground text-sm bg-card rounded-md border hover:bg-card border-input transition-colors text-left"
      >
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 shrink-0" />
          <span>{formatDate(value)}</span>
        </div>
      </Button>
    </div>
  )
}

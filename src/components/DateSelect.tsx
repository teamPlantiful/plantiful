'use client'

import { useState } from 'react'
import { CalendarIcon } from 'lucide-react'
import Button from './common/button'
import { formatDate } from '@/utils/date'
import { Popover } from './common/popover'
import { Calendar } from './common/calendar'

interface DateSelectProps {
  label: string
  value: Date
  onChange: (date: Date) => void
}

export function DateSelect({ label, value, onChange }: DateSelectProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleDateChange = (date: Date) => {
    onChange(date)
    setIsOpen(false)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-foreground/80">{label}</label>
      <Popover
        isOpen={isOpen}
        onClose={setIsOpen}
        content={<Calendar value={value} onChange={handleDateChange} />}
        side="bottom"
        align="start"
        className="block"
      >
        <Button
          onClick={handleClick}
          variant="ghost"
          className="w-full flex items-center justify-between gap-2 px-3 py-2 text-muted-foreground text-sm bg-card rounded-md border hover:bg-card border-input transition-colors text-left"
        >
          <div className="flex items-center gap-3">
            <CalendarIcon className="h-4 w-4 shrink-0" />
            <span>{formatDate(value)}</span>
          </div>
        </Button>
      </Popover>
    </div>
  )
}

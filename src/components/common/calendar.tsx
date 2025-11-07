'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthCalendarDays, isSameDay, formatMonthYear } from '@/utils/date'
import cn from '@/lib/cn'
import Button from './button'

interface CalendarProps {
  value: Date
  onChange: (date: Date) => void
}

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

export function Calendar({ value, onChange }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(value.getMonth())
  const [currentYear, setCurrentYear] = useState(value.getFullYear())

  // value가 변경되면 해당 날짜의 월/년으로 이동
  useEffect(() => {
    setCurrentMonth(value.getMonth())
    setCurrentYear(value.getFullYear())
  }, [value])

  const days = getMonthCalendarDays(currentYear, currentMonth)

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const handleDateClick = (date: Date) => {
    onChange(date)
  }

  return (
    <div className="bg-card rounded-lg p-3 w-60 sm:w-68">
      <div className="flex items-center justify-between mb-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevMonth}
          className="w-8 h-8 text-muted-foreground hover:text-foreground rounded-full border border-border"
          aria-label="이전 달"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <h2 className="text-base font-semibold">
          {formatMonthYear(new Date(currentYear, currentMonth))}
        </h2>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleNextMonth}
          className="w-8 h-8 text-muted-foreground hover:text-foreground rounded-full border border-border"
          aria-label="다음 달"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const isSelected = isSameDay(day.fullDate, value)
          const isCurrentMonth = day.month === 'current'
          const isToday = isSameDay(day.fullDate, new Date())

          return (
            <Button
              key={index}
              variant={isSelected ? 'default' : 'ghost'}
              size="sm"
              onClick={() => handleDateClick(day.fullDate)}
              className={cn(
                'rounded-full',
                !isCurrentMonth && 'text-muted-foreground/30',
                isToday && !isSelected && 'ring-1 ring-primary/30'
              )}
            >
              {day.date}
            </Button>
          )
        })}
      </div>
    </div>
  )
}

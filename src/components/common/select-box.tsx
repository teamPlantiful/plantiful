'use client'

import { ChevronDown, Check } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import cn from '@/lib/cn'

interface SelectBoxProps {
  value: string
  placeholder: string
  options: { value: string; label: string }[]
  onSelect: (value: string) => void
  className?: string
}

export default function SelectBox({
  value,
  placeholder,
  options,
  onSelect,
  className,
}: SelectBoxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [hoveredValue, setHoveredValue] = useState<string | null>(null)
  const selectRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])

  const handleOptionClick = (optionValue: string) => {
    onSelect(optionValue)
    setIsOpen(false)
  }

  const selectedOption = options.find((option) => option.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  return (
    <div ref={selectRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-11 w-full items-center justify-between rounded-md border border-input bg-popover px-2.5 py-2.5 cursor-pointer text-sm ring-offset-background',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          '[&>span]:line-clamp-1'
        )}
      >
        <span className={cn(!selectedOption && 'text-muted-foreground')}>{displayText}</span>
        <ChevronDown
          className={cn('size-4 opacity-50 transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      {isOpen && (
        <div
          className={cn(
            'absolute z-50 w-full mt-2 min-w-32 max-h-96 overflow-hidden rounded-md border bg-popver text-popover-foreground shadow-md',
            'animate-in fade-in-0 zoom-in-95'
          )}
        >
          <div className="p-1 max-h-60 overflow-auto">
            {options.map((option) => {
              const isSelected = value === option.value
              const isHovered = hoveredValue === option.value
              const shouldShowBg = hoveredValue ? isHovered : isSelected

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleOptionClick(option.value)}
                  onMouseEnter={() => setHoveredValue(option.value)}
                  onMouseLeave={() => setHoveredValue(null)}
                  className={cn(
                    'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors',
                    shouldShowBg && 'bg-accent/40 text-accent-foreground'
                  )}
                >
                  <span className="absolute left-2 flex size-3.5 items-center justify-center">
                    {isSelected && <Check className="size-4" />}
                  </span>
                  <span>{option.label}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

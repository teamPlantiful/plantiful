'use client'

import { ChevronDown, Check } from 'lucide-react'
import { useState, useEffect } from 'react'
import cn from '@/lib/cn'
import { Popover } from './popover'

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

  // 선택된 옵션으로 스크롤
  useEffect(() => {
    if (isOpen && value) {
      // Popover가 렌더링된 후 스크롤
      setTimeout(() => {
        const selectedElement = document.querySelector(`[data-value="${value}"]`)
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: 'nearest', behavior: 'auto' })
        }
      }, 0)
    }
  }, [isOpen, value])

  const handleOptionClick = (optionValue: string) => {
    onSelect(optionValue)
    setIsOpen(false)
  }

  const handleClick = () => {
    setIsOpen(!isOpen)
  }

  const selectedOption = options.find((option) => option.value === value)
  const displayText = selectedOption ? selectedOption.label : placeholder

  const selectContent = (
    <div className="p-1 max-h-60 w-full overflow-auto custom-scrollbar">
      {options.map((option) => {
        const isSelected = value === option.value
        const isHovered = hoveredValue === option.value
        const shouldShowBg = hoveredValue ? isHovered : isSelected

        return (
          <button
            key={option.value}
            type="button"
            data-value={option.value}
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
  )

  return (
    <Popover
      isOpen={isOpen}
      onClose={setIsOpen}
      content={selectContent}
      side="bottom"
      align="start"
      className={cn('block', className)}
    >
      <button
        type="button"
        onClick={handleClick}
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
    </Popover>
  )
}

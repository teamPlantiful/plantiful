'use client'

import { ReactNode, useEffect, useRef, useState, useCallback, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import cn from '@/lib/cn'

interface PopoverProps {
  children: ReactNode
  content: ReactNode
  isOpen?: boolean
  onClose?: (open: boolean) => void
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
}

export function Popover({
  children,
  content,
  isOpen: controlledIsOpen,
  onClose,
  align = 'start',
  side = 'bottom',
  sideOffset = 4,
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [finalSide, setFinalSide] = useState<'top' | 'bottom' | 'left' | 'right'>(side)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const isMountedRef = useRef(true)

  // Controlled vs Uncontrolled
  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (!isMountedRef.current) return
      if (!isControlled) {
        setUncontrolledIsOpen(value)
      }
      onClose?.(value)
    },
    [isControlled, onClose]
  )

  useEffect(() => {
    setMounted(true)
    return () => {
      isMountedRef.current = false
    }
  }, [])

  // 이벤트 리스너 통합 (ESC 키, 외부 클릭)
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleOpenChange(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        contentRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        !contentRef.current.contains(e.target as Node)
      ) {
        handleOpenChange(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, handleOpenChange])

  // Popover 위치 계산 (자동 flip 포함)
  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return

    const updatePosition = () => {
      // unmount되었거나 ref가 없으면 중단
      if (!isMountedRef.current || !triggerRef.current || !contentRef.current) return

      const triggerRect = triggerRef.current.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

      // 각 방향의 사용 가능한 공간 계산
      const spaceBottom = window.innerHeight - triggerRect.bottom
      const spaceTop = triggerRect.top
      const spaceRight = window.innerWidth - triggerRect.right
      const spaceLeft = triggerRect.left

      // 최적의 방향 결정
      let calculatedSide = side
      const contentHeight = contentRect.height
      const contentWidth = contentRect.width

      if (side === 'bottom' && spaceBottom < contentHeight + sideOffset && spaceTop > spaceBottom) {
        calculatedSide = 'top'
      } else if (
        side === 'top' &&
        spaceTop < contentHeight + sideOffset &&
        spaceBottom > spaceTop
      ) {
        calculatedSide = 'bottom'
      } else if (
        side === 'right' &&
        spaceRight < contentWidth + sideOffset &&
        spaceLeft > spaceRight
      ) {
        calculatedSide = 'left'
      } else if (
        side === 'left' &&
        spaceLeft < contentWidth + sideOffset &&
        spaceRight > spaceLeft
      ) {
        calculatedSide = 'right'
      }

      setFinalSide(calculatedSide)

      let top = 0
      let left = 0

      // calculatedSide에 따른 위치 계산
      switch (calculatedSide) {
        case 'bottom':
          top = triggerRect.bottom + sideOffset
          break
        case 'top':
          top = triggerRect.top - contentRect.height - sideOffset
          break
        case 'left':
          left = triggerRect.left - contentRect.width - sideOffset
          top = triggerRect.top
          break
        case 'right':
          left = triggerRect.right + sideOffset
          top = triggerRect.top
          break
      }

      // align에 따른 위치 조정
      if (calculatedSide === 'top' || calculatedSide === 'bottom') {
        switch (align) {
          case 'start':
            left = triggerRect.left
            break
          case 'center':
            left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
            break
          case 'end':
            left = triggerRect.right - contentRect.width
            break
        }
      } else {
        switch (align) {
          case 'start':
            top = triggerRect.top
            break
          case 'center':
            top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
            break
          case 'end':
            top = triggerRect.bottom - contentRect.height
            break
        }
      }

      // 화면 밖으로 나가지 않도록 조정
      const padding = 8
      if (left + contentRect.width > window.innerWidth - padding) {
        left = window.innerWidth - contentRect.width - padding
      }
      if (left < padding) {
        left = padding
      }
      if (top + contentRect.height > window.innerHeight - padding) {
        top = window.innerHeight - contentRect.height - padding
      }
      if (top < padding) {
        top = padding
      }

      setPosition({ top, left })
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, side, align, sideOffset])

  const handleTriggerClick = useCallback(() => {
    handleOpenChange(!isOpen)
  }, [isOpen, handleOpenChange])

  const popoverContent =
    isOpen && mounted
      ? createPortal(
          <div
            ref={contentRef}
            className={cn(
              'fixed z-50',
              'bg-popover text-popover-foreground',
              'rounded-md border border-border shadow-lg',
              'animate-in fade-in-0 zoom-in-95',
              'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95'
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            data-state={isOpen ? 'open' : 'closed'}
          >
            {content}
          </div>,
          document.body
        )
      : null

  return (
    <>
      <div ref={triggerRef} onClick={handleTriggerClick} className="inline-block">
        {children}
      </div>
      {popoverContent}
    </>
  )
}

export function PopoverTrigger({ children, asChild }: { children: ReactNode; asChild?: boolean }) {
  if (asChild && typeof children === 'object' && children !== null && 'type' in children) {
    return children
  }
  return <>{children}</>
}

export function PopoverContent({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return <div className={cn('p-4', className)}>{children}</div>
}

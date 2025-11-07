'use client'

import { ReactNode, useEffect, useRef, useState, useCallback } from 'react'
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
  className?: string
}

export function Popover({
  children,
  content,
  isOpen: controlledIsOpen,
  onClose,
  align = 'start',
  side = 'bottom',
  sideOffset = 8,
  className,
}: PopoverProps) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const triggerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  const isControlled = controlledIsOpen !== undefined
  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen

  const handleOpenChange = useCallback(
    (value: boolean) => {
      if (!isControlled) {
        setUncontrolledIsOpen(value)
      }
      onClose?.(value)
    },
    [isControlled, onClose]
  )

  useEffect(() => {
    setMounted(true)
  }, [])

  // ESC 키와 외부 클릭
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleOpenChange(false)
    }

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        contentRef.current &&
        !contentRef.current.contains(target)
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

  // 위치 계산
  useEffect(() => {
    if (!isOpen || !triggerRef.current || !contentRef.current) return

    const updatePosition = () => {
      if (!triggerRef.current || !contentRef.current) return

      const trigger = triggerRef.current.getBoundingClientRect()
      const content = contentRef.current.getBoundingClientRect()

      let top = 0
      let left = 0

      // 기본 위치 계산
      if (side === 'bottom') {
        top = trigger.bottom + sideOffset
        left =
          align === 'start'
            ? trigger.left
            : align === 'end'
              ? trigger.right - content.width
              : trigger.left + trigger.width / 2 - content.width / 2
      } else if (side === 'top') {
        top = trigger.top - content.height - sideOffset
        left =
          align === 'start'
            ? trigger.left
            : align === 'end'
              ? trigger.right - content.width
              : trigger.left + trigger.width / 2 - content.width / 2
      } else if (side === 'left') {
        left = trigger.left - content.width - sideOffset
        top =
          align === 'start'
            ? trigger.top
            : align === 'end'
              ? trigger.bottom - content.height
              : trigger.top + trigger.height / 2 - content.height / 2
      } else if (side === 'right') {
        left = trigger.right + sideOffset
        top =
          align === 'start'
            ? trigger.top
            : align === 'end'
              ? trigger.bottom - content.height
              : trigger.top + trigger.height / 2 - content.height / 2
      }

      // 자동 flip
      const spaceBottom = window.innerHeight - trigger.bottom
      const spaceTop = trigger.top
      if (side === 'bottom' && spaceBottom < content.height && spaceTop > spaceBottom) {
        top = trigger.top - content.height - sideOffset
      } else if (side === 'top' && spaceTop < content.height && spaceBottom > spaceTop) {
        top = trigger.bottom + sideOffset
      }

      // 화면 밖으로 나가지 않도록
      const padding = 8
      left = Math.max(padding, Math.min(left, window.innerWidth - content.width - padding))
      top = Math.max(padding, Math.min(top, window.innerHeight - content.height - padding))

      contentRef.current.style.top = `${top}px`
      contentRef.current.style.left = `${left}px`
    }

    // 초기 위치 설정
    requestAnimationFrame(updatePosition)

    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen, side, align, sideOffset])

  if (!mounted || !isOpen)
    return (
      <div ref={triggerRef} className={className}>
        {children}
      </div>
    )

  return (
    <>
      <div ref={triggerRef} className={className}>
        {children}
      </div>
      {createPortal(
        <div
          ref={contentRef}
          className="fixed z-9999 bg-popover text-popover-foreground rounded-md border border-border shadow-lg"
          style={{ top: 0, left: 0 }}
        >
          {content}
        </div>,
        document.body
      )}
    </>
  )
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

'use client'

import { useEffect, useState } from 'react'
import cn from '@/lib/cn'
import Button from '@/components/common/button'
import { Card } from '@/components/common/card'

export type ToastType = 'success' | 'error' | 'info' | 'default'

interface ToastProps {
  id: string
  message: string
  type: ToastType
  duration?: number
  onClose: () => void
}

const TOAST_STYLES: Record<ToastType, string> = {
  default: '',
  success:
    'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-200',
  error:
    'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-200',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200',
}

const TOAST_ICONS = {
  default: null,
  success: (
    <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  info: (
    <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
}

export default function Toast({ id, message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(false)

  const handleClose = () => {
    setIsVisible(false)
    setTimeout(onClose, 300)
  }
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true)
    })

    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  return (
    <Card
      role="alert"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm items-center p-4 shadow-lg',
        'transition-all duration-300 ease-in-out',
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0',
        TOAST_STYLES[type]
      )}
    >
      <div className="mr-3 flex-shrink-0">{TOAST_ICONS[type]}</div>
      <div className="text-sm font-medium flex-1">{message}</div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="ml-2 -mx-1.5 -my-1.5 h-8 w-8 opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
      >
        <span className="sr-only">Close</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </Button>
    </Card>
  )
}

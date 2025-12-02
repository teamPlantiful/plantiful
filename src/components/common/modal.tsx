'use client'

import { ComponentPropsWithRef, ReactNode, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/common/card'
import cn from '@/lib/cn'

interface ModalProps extends ComponentPropsWithRef<'div'> {
  open: boolean
  onClose: () => void
  children?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'
  closeOnBackdrop?: boolean
  closeOnEscape?: boolean
  zIndex?: number
}

export function Modal({
  open,
  onClose,
  children,
  size = 'md',
  closeOnBackdrop = false,
  closeOnEscape = true,
  zIndex = 50, // 기본 zIndex 값 설정 (일반 모달은 50)
  className,
  ...props
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const scrollYRef = useRef<number>(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open || !closeOnEscape) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open, onClose, closeOnEscape])

  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollYRef.current}px`
      document.body.style.width = '100%'
    }

    return () => {
      if (open) {
        const scrollY = scrollYRef.current
        document.body.style.position = ''
        document.body.style.top = ''
        document.body.style.width = ''
        window.scrollTo(0, scrollY)
      }
    }
  }, [open])

  if (!open || !mounted) return null

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdrop && e.target === e.currentTarget) {
      onClose()
    }
  }

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full mx-4',
  }

  const modalContent = (
    <>
      {/* Backdrop: z-class 제거하고 style로 zIndex 직접 제어 */}
      <div
        style={{ zIndex: zIndex }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={handleBackdropClick}
      />

      {/* Content Wrapper: Backdrop보다 10 높게 설정 */}
      <div
        style={{ zIndex: zIndex + 10 }}
        className="fixed inset-0 flex items-center justify-center pointer-events-none"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Content - Card 컴포넌트 재사용 */}
        <Card
          ref={modalRef}
          className={cn(
            'relative w-full mx-4 my-8 max-h-[90vh] pointer-events-auto p-6',
            sizeClasses[size],
            className
          )}
          {...props}
        >
          {children}
        </Card>
      </div>
    </>
  )

  return createPortal(modalContent, document.body)
}

// Modal 전용 Header/Content/Footer - 패딩 제거하고 CardHeader/Content/Footer 래핑
export function ModalHeader({ className, ...props }: ComponentPropsWithRef<typeof CardHeader>) {
  return <CardHeader className={cn('p-0', className)} {...props} />
}

export function ModalContent({ className, ...props }: ComponentPropsWithRef<typeof CardContent>) {
  return <CardContent className={cn('p-0', className)} {...props} />
}

export function ModalFooter({ className, ...props }: ComponentPropsWithRef<typeof CardFooter>) {
  return <CardFooter className={cn('p-0', className)} {...props} />
}

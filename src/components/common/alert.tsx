'use client'

import { ReactNode } from 'react'
import { Modal, ModalHeader, ModalContent, ModalFooter } from './modal'
import Button from '@/components/common/button'
import cn from '@/lib/cn'

interface AlertProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  description?: ReactNode
  children?: ReactNode

  // 버튼
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  showCancel?: boolean

  // 스타일 
  variant?: 'default' | 'destructive'
  loading?: boolean
}

export function Alert({
  open,
  onClose,
  title,
  description,
  children,
  confirmText = '확인',
  cancelText = '취소',
  onConfirm,
  showCancel = true,
  variant = 'default',
  loading = false,
}: AlertProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm()
    } else {
      onClose()
    }
  }

  return (
    <Modal open={open} onClose={onClose} size="sm" closeOnBackdrop={false} closeOnEscape={true}>
      <div className="flex flex-col gap-4">
        {/* 제목 영역 */}
        {title && (
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
          </ModalHeader>
        )}

        {/* 본문 영역 */}
        <ModalContent>
          <div className="text-sm text-gray-500 dark:text-gray-400">{description || children}</div>
        </ModalContent>

        {/* 버튼 영역 */}
        <ModalFooter className="flex justify-end gap-2 sm:justify-end">
          {showCancel && (
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {cancelText}
            </Button>
          )}

          <Button variant={variant} onClick={handleConfirm} isLoading={loading}>
            {confirmText}
          </Button>
        </ModalFooter>
      </div>
    </Modal>
  )
}

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
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  showCancel?: boolean
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
    <Modal
      open={open}
      onClose={onClose}
      size="sm"
      closeOnBackdrop={false}
      closeOnEscape={true}
      zIndex={100}
    >
      <div className="flex flex-col gap-4">
        {title && (
          <ModalHeader className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold leading-none tracking-tight">{title}</h2>
          </ModalHeader>
        )}

        <ModalContent className="mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-600">{description || children}</div>
        </ModalContent>

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

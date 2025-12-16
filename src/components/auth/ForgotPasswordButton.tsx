'use client'

import { useState } from 'react'
import { Modal, ModalContent, ModalHeader } from '@/components/common/modal'
import ForgotPasswordInputForm from '@/components/auth/ForgotPasswordInputForm'
import Button from '@/components/common/button'

interface Props {
  label?: string
}

export default function ForgotPasswordButton({ label = '비밀번호를 잊으셨나요?' }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        type="button"
        variant="link"
        onClick={() => setIsOpen(true)}
        className="text-primary hover:underline cursor-pointer"
      >
        {label}
      </Button>

      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        size="sm"
        closeOnBackdrop
        closeOnEscape
      >
        <ModalHeader className='flex items-center justify-between p-2 text-card-foreground'>
          <span className="text-xl font-bold">비밀번호 찾기</span>
          <p className="pt-1 pb-6 text-sm">비밀번호를 찾으실 이메일을 입력해주세요</p> 
        </ModalHeader>
        <ModalContent className='p-2 text-card-foreground'>
          <ForgotPasswordInputForm />
        </ModalContent>
      </Modal>
    </>
  )
}
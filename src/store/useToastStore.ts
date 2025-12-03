import { create } from 'zustand'
import { ToastType } from '@/components/common/toast'

interface ToastData {
  id: string
  message: string
  type: ToastType
}

interface ToastStore {
  toasts: ToastData[]
  toast: (message: string, type?: ToastType) => void
  removeToast: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  // 토스트 추가
  toast: (message, type = 'default') => {
    const id = Math.random().toString(36).substring(2, 9)
    set((state) => ({
      toasts: [...state.toasts, { id, message, type }],
    }))
  },

  // 토스트 삭제
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },
}))

export const toast = (message: string, type?: ToastType) =>
  useToastStore.getState().toast(message, type)

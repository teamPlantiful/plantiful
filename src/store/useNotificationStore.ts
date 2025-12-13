'use client'

import { create } from 'zustand'

export type AppNotificationSource = 'fcm' | 'local'

export interface AppNotification {
  id: string
  title: string
  body?: string
  createdAt: string
  read: boolean
  source: AppNotificationSource
  data?: Record<string, string>
}

interface NotificationStore {
  notifications: AppNotification[]
  unreadCount: number
  addNotification: (input: {
    id?: string
    title: string
    body?: string
    source: AppNotificationSource
    data?: Record<string, string>
  }) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  setNotifications: (items: AppNotification[]) => void
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  setNotifications: (items) =>
    set({
      notifications: items,
      unreadCount: items.filter((n) => !n.read).length,
    }),

  addNotification: (input) => {
    const id = input.id ?? crypto.randomUUID()

    const newItem: AppNotification = {
      id,
      title: input.title,
      body: input.body,
      createdAt: new Date().toISOString(),
      read: false,
      source: input.source,
      data: input.data,
    }

    const prev = get().notifications
    const next = [newItem, ...prev]
    set({
      notifications: next,
      unreadCount: next.filter((n) => !n.read).length,
    })
  },

  markAsRead: (id) => {
    const next = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    set({
      notifications: next,
      unreadCount: next.filter((n) => !n.read).length,
    })
  },

  markAllAsRead: () => {
    const next = get().notifications.map((n) => ({ ...n, read: true }))
    set({
      notifications: next,
      unreadCount: 0,
    })
  },
}))

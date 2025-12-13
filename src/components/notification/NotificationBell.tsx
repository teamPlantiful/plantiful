'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import NotificationCenter from './NotificationCenter'
import { useNotificationStore } from '@/store/useNotificationStore'

export default function NotificationBell() {
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="relative inline-flex">
        <button
          type="button"
          className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center"
          onClick={() => setOpen(true)}
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </button>

        <NotificationCenter open={open} onClose={() => setOpen(false)} />
      </div>
    </>
  )
}

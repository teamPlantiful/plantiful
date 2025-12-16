'use client'

import { startTransition } from 'react'
import { X } from 'lucide-react'
import { Card } from '@/components/common/card'
import Button from '@/components/common/button'
import { useNotificationStore } from '@/store/useNotificationStore'
import {
  NotificationReadAction,
  AllNotificationsReadAction,
} from '@/app/actions/notification/notificationReadAction'

interface NotificationCenterProps {
  open: boolean
  onClose: () => void
}

export default function NotificationCenter({ open, onClose }: NotificationCenterProps) {
  const notifications = useNotificationStore((s) => s.notifications)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)

  if (!open) return null

  //단일 읽음
  const handleItemClick = (id: string) => {
    markAsRead(id)

    startTransition(() => {
      void NotificationReadAction(id)
    })
  }

  //전체 읽음
  const handleMarkAllRead = () => {
    markAllAsRead()

    startTransition(() => {
      void AllNotificationsReadAction()
    })
  }

  return (
  <div className="fixed inset-0 z-[140] flex items-start justify-center px-4 sm:justify-end sm:px-2">
    <div className="absolute inset-0" onClick={onClose} />

    <Card
      className="relative z-[150] mt-16 w-full max-w-[calc(100vw-2rem)] sm:max-w-sm sm:mr-4 border border-border bg-background shadow-lg
      "
    >
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">알림 센터</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] text-primary">
                새 알림 {unreadCount}개
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs">
            {notifications.length > 0 && (
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={handleMarkAllRead}
              >
                모두 읽음
              </button>
            )}
            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-4 py-2">
          {notifications.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              아직 받은 알림이 없어요
            </p>
          ) : (
            <ul className="space-y-2">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                    n.read ? 'bg-muted/40' : 'bg-primary/5'
                  }`}
                  onClick={() => handleItemClick(n.id)}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium">{n.title}</p>
                    <span className="ml-2 text-[10px] text-muted-foreground">
                      {new Date(n.createdAt).toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  {n.body && <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>}
                  <span className="mt-1 inline-block text-[10px] text-muted-foreground">
                    {n.source === 'fcm' ? 'FCM 알림' : '앱 알림'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  )
}

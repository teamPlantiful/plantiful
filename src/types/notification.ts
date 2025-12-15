export type NotificationEvent =
  | 'WATERED'
  | 'PLANT_CREATED'
  | 'PLANT_DELETED'
  | 'PLANT_UPDATED'
  | 'NICKNAME_UPDATED'

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

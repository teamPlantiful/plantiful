'use client'

import { initializeApp, getApps, getApp } from 'firebase/app'
import {
  getMessaging,
  isSupported,
  Messaging,
  getToken,
  onMessage,
  MessagePayload,
} from 'firebase/messaging'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

function getFirebaseApp() {
  if (typeof window === 'undefined') {
    throw new Error('Firebase must be used in the browser')
  }

  if (!getApps().length) {
    return initializeApp(firebaseConfig)
  }
  return getApp()
}

// 브라우저에서 FCM 지원 여부 확인 + Messaging 인스턴스 가져오기
export async function getFirebaseMessagingInstance(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null

  const supported = await isSupported()
  if (!supported) return null

  const app = getFirebaseApp()
  return getMessaging(app)
}

// 알림 권한 요청 + FCM 토큰 발급
export async function requestFcmToken(): Promise<string | null> {
  const messaging = await getFirebaseMessagingInstance()
  if (!messaging) return null

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    console.warn('알림 권한이 거부되었습니다.')
    return null
  }

  const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY!
  const token = await getToken(messaging, { vapidKey })

  return token
}

// 페이지가 열려 있을 때 들어오는 메시지 구독
export async function subscribeForegroundMessages(handler: (payload: MessagePayload) => void) {
  const messaging = await getFirebaseMessagingInstance()
  if (!messaging) return

  onMessage(messaging, handler)
}

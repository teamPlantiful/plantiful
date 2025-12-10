'use client'

import { useEffect, useState } from 'react'
import { requestFcmToken, subscribeForegroundMessages } from '@/utils/firebase/firebaseClient'

export default function TestFcmPage() {
  const [token, setToken] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 버튼 누르면 FCM 토큰 요청
  const handleClick = async () => {
    try {
      const t = await requestFcmToken()
      setToken(t)
    } catch (e: any) {
      console.error(e)
      setError(e.message ?? '에러 발생')
    }
  }

  // 이 페이지가 열려 있는 동안 FCM 메시지 수신 → alert로 보여주기
  useEffect(() => {
    subscribeForegroundMessages((payload) => {
      console.log('FCM foreground message:', payload)

      const title = payload.notification?.title ?? '알림'
      const body = payload.notification?.body ?? ''

      alert(`${title}\n${body}`)
    })
  }, [])

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">FCM 테스트</h1>
      <button onClick={handleClick} className="px-4 py-2 rounded bg-green-600 text-white">
        FCM 토큰 요청
      </button>

      {token && <pre className="mt-4 whitespace-pre-wrap break-all text-xs">{token}</pre>}

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </main>
  )
}

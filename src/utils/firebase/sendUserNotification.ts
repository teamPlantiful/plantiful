import type { SupabaseClient } from '@supabase/supabase-js'
import { getFirebaseMessaging } from './firebaseAdmin'

interface NotificationPayload {
  title: string
  body: string
  data?: Record<string, string>
}

type AppSupabaseClient = SupabaseClient<any>

// 현재 로그인 유저 기준으로, 해당 user_id의 모든 FCM 토큰에 알림 전송
export async function sendNotificationToUser(
  supabase: AppSupabaseClient,
  userId: string,
  { title, body, data }: NotificationPayload
) {
  // 1) 유저의 활성 토큰 조회
  const { data: tokens, error } = await supabase
    .from('push_tokens')
    .select('token')
    .eq('user_id', userId)
    .eq('is_active', true)

  if (error) {
    console.error('[sendNotificationToUser] token select error:', error)
    return
  }

  if (!tokens || tokens.length === 0) {
    console.log('[sendNotificationToUser] no tokens for user:', userId)
    return
  }

  const registrationTokens = tokens.map((t) => t.token)

  const messaging = getFirebaseMessaging()

  try {
    const res = await messaging.sendEachForMulticast({
      tokens: registrationTokens,
      notification: {
        title,
        body,
      },
      data,
    })

    if (res.failureCount > 0) {
      console.warn(
        '[sendNotificationToUser] some tokens failed:',
        res.responses.map((r, idx) => (!r.success ? registrationTokens[idx] : null)).filter(Boolean)
      )
    }
  } catch (e) {
    console.error('[sendNotificationToUser] FCM send error:', e)
  }
}

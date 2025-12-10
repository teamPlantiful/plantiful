// FCM에서 권장하는 compat 방식
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/10.13.2/firebase-messaging-compat.js')

// Firebase 웹 앱 설정 그대로 사용
firebase.initializeApp({
  apiKey: 'AIzaSyAPUujk6rgv5KjRbx2Y2QGm9OmF4apugEI',
  authDomain: 'plantiful-fcm.firebaseapp.com',
  projectId: 'plantiful-fcm',
  storageBucket: 'plantiful-fcm.firebasestorage.app',
  messagingSenderId: '176039076010',
  appId: '1:176039076010:web:946273e148d352e8b2b0d3',
  measurementId: 'G-83S2L0BGP2',
})

// 서비스워커에서 FCM 메시지 받는 인스턴스
const messaging = firebase.messaging()

// 앱이 백그라운드/비활성일 때 오는 메시지 처리
messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Background message:', payload)

  const notificationTitle = payload.notification?.title || '알림'
  const notificationOptions = {
    body: payload.notification?.body || '',
    // 아이콘 파일 있으면 사용, 없어도 에러는 안 남
    icon: '/plantiful-logo.png',
  }

  self.registration.showNotification(notificationTitle, notificationOptions)
})

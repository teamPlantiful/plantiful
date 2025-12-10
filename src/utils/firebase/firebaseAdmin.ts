import admin from 'firebase-admin'

let app: admin.app.App | null = null

function getFirebaseAdminApp() {
  if (app) return app

  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('Firebase admin env vars are not set')
  }

  const fixedPrivateKey = privateKey.replace(/\\n/g, '\n')

  app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      clientEmail,
      privateKey: fixedPrivateKey,
    }),
  })

  return app
}

export function getFirebaseMessaging() {
  return getFirebaseAdminApp().messaging()
}

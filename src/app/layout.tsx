import './globals.css'
import { AuthProvider } from '@/providers/authProvider'
import QueryProvider from '@/providers/query-provider'

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>
          <QueryProvider>
            {children}
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
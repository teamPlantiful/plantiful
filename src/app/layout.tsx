import './globals.css'
import { Toaster } from '@/components/common/toaster'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>{children}</body>
      <Toaster />
    </html>
  )
}

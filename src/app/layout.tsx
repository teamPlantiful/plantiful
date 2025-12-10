import './globals.css'
import { Toaster } from '@/components/common/toaster'
import FcmInAppListener from '@/components/notification/FcmInAppListener'

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        {children}
        <FcmInAppListener />
      </body>
      <Toaster />
    </html>
  )
}

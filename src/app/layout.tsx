import './globals.css'
import { Toaster } from '@/components/common/toaster'
import { Noto_Sans_KR, Pacifico } from 'next/font/google'
import type { Metadata } from 'next'

const notoSansKR = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
  variable: '--font-noto-sans',
})

const pacifico = Pacifico({
  subsets: ['latin'],
  weight: '400',
  display: 'swap',
  variable: '--font-pacifico',
})

export const metadata: Metadata = {
  title: 'Plantiful',
  description:
    '식물 키우기가 처음이라면? Plantiful과 함께 시작하세요. 물주기 알림, 성장 기록, 맞춤 관리 팁까지 한 번에!',
  keywords: ['식물 관리', '반려식물', '물주기 알림', '식물 키우기', '가드닝'],
  authors: [{ name: 'Plantiful Team' }],
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName: 'Plantiful',
    title: 'Plantiful - 나만의 식물 관리 서비스',
    description: '식물 키우기가 처음이라면? Plantiful과 함께 시작하세요.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} ${pacifico.variable}`}>
      <body>{children}</body>
      <Toaster />
    </html>
  )
}

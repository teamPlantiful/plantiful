import Header from '@/components/Header'
import DashboardClient from './dashboard-client'
import { Suspense } from 'react'

export default function Home() {
  return (
    <>
      <Header />
      <Suspense fallback={null}>
        <DashboardClient />
      </Suspense>
    </>
  )
}

import Header from "@/components/Header"
import { ReactNode } from 'react'

export default function HomePage({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen bg-background pb-20">
      <Header />
      <main>
        {children}
      </main>
    </div>
  )
}

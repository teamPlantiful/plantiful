
import { ReactNode } from 'react'

export default function HomePage({ children }: { children: ReactNode }) {

  return (
    <div className="min-h-screen bg-background">
      <main>
        {children}
      </main>
    </div>
  )
}

import { Leaf, User } from 'lucide-react'
import Link from 'next/link'

export default function Header() {
  return (
    <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border px-4 py-4 shadow-soft">
      <div className="max-w-xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-5.5 h-5.5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold text-primary">Plantiful</h1>
        </div>
        <Link href="/mypage" prefetch={false}>
          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-4 w-4" />
          </div>
        </Link>
      </div>
    </div>
  )
}

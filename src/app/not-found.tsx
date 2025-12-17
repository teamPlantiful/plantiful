import Link from "next/link"
import { Card, CardHeader, CardContent } from "@/components/common/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-200 mx-auto p-4 space-y-4 animate-fade-in">
        <Card className="shadow-card flex-col justify-center">
          <CardHeader className="mt-20 flex-col justify-center">
            <span className="text-2xl sm:text-4xl lg:text-5xl font-bold text-primary">404 Not Found</span>
          </CardHeader>
          <CardContent className="flex-1 flex-col">
            <p className="text-4xl lg:text-5xl text-center select-none mt-5">🍃</p>
          </CardContent>
          <CardContent>
            <div className="mb-20 flex flex-col gap-5 items-center justify-center">
              <p className="text-sm sm:text-base lg:text-lg">이런! 페이지를 찾을 수 없습니다.</p>
              <Link className="text-xs sm:text-sm lg:text-base text-[#006699] hover:underline" href="/">홈으로 돌아가기</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
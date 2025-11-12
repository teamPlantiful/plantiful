import { Card, CardContent } from '@/components/common/card'

export default function TodayPlantSection() {
  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold text-foreground">오늘의식물</h2>
        <span className="text-sm text-muted-foreground">몬스테라</span>
      </div>

      <Card className="overflow-hidden rounded-(--radius-lg) border-0">
        <CardContent className="p-0">
          <div className="w-full h-80 grid place-items-center rounded-[calc(var(--radius-lg)-2px)] bg-linear-to-b from-[hsl(103_43%_92%)] to-[hsl(60_10%_98%)]">
            <span className="text-sm text-muted-foreground">3D 이미지 박스</span>
          </div>
        </CardContent>
      </Card>
    </section>
  )
}

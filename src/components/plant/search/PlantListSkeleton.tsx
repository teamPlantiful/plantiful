interface PlantListSkeletonProps {
  count?: number
}

export default function PlantListSkeleton({ count = 6 }: PlantListSkeletonProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-full flex items-center gap-3 p-4 rounded-lg border border-border animate-pulse bg-card"
        >
          <div className="w-12 h-12 rounded-md bg-muted shrink-0" />

          <div className="flex flex-col gap-1.5 flex-1">
            <div className="h-6 w-1/3 bg-muted rounded" />
            <div className="h-4 w-1/2 bg-muted rounded" />
          </div>
        </div>
      ))}
    </div>
  )
}

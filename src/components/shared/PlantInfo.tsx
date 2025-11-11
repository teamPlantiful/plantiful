'use client'

interface PlantInfoProps {
  koreanName: string
  scientificName?: string
  className?: string
}

export function PlantInfo({ koreanName, scientificName, className }: PlantInfoProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold text-lg text-foreground/80">{koreanName}</h3>
      {scientificName && <p className="text-sm text-muted-foreground italic">{scientificName}</p>}
    </div>
  )
}

'use client'

interface PlantInfoProps {
  commonName: string
  scientificName?: string
  className?: string
}

export function PlantInfo({ commonName, scientificName, className }: PlantInfoProps) {
  return (
    <div className={className}>
      <h3 className="font-semibold text-md text-foreground/80">{commonName}</h3>
      {scientificName && <p className="text-sm text-muted-foreground italic">{scientificName}</p>}
    </div>
  )
}

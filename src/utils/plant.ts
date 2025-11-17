import type { Plant, PlantData } from '@/types/plant'

export const prepareCardForInsert = (plantData: PlantData, userId: string): Partial<Plant> => {
  const {
    species,
    nickname,
    wateringInterval,
    fertilizerInterval,
    repottingInterval,
    startDate,
    lastWateredDate,
    image,
  } = plantData

  const nextWateringDate = new Date(lastWateredDate)
  nextWateringDate.setDate(nextWateringDate.getDate() + wateringInterval)

  return {
    userId,
    cntntsNo: species.cntntsNo,
    commonName: species.commonName,
    scientificName: species.scientificName || null,
    defaultImageUrl: species.imageUrl || null,
    coverImageUrl: image || null,
    nickname,
    wateringIntervalDays: wateringInterval,
    fertilizerIntervalDays: fertilizerInterval,
    repottingIntervalDays: repottingInterval,
    adoptedAt: startDate.toISOString(),
    lastWateredAt: lastWateredDate.toISOString(),
    nextWateringDate: nextWateringDate.toISOString(),
    lightDemandCode: species.careInfo?.lightDemandCode || null,
    waterCycleCode: species.careInfo?.waterCycleCode || null,
    temperatureCode: species.careInfo?.temperatureCode || null,
    humidityCode: species.careInfo?.humidityCode || null,
  }
}

// Plant (camelCase) to DB format (snake_case)
export const toDbFormat = (plant: Partial<Plant>) => {
  return {
    id: plant.id,
    user_id: plant.userId,
    cntnts_no: plant.cntntsNo,
    common_name: plant.commonName,
    scientific_name: plant.scientificName,
    default_image_url: plant.defaultImageUrl,
    cover_image_url: plant.coverImageUrl,
    nickname: plant.nickname,
    watering_interval_days: plant.wateringIntervalDays,
    fertilizer_interval_days: plant.fertilizerIntervalDays,
    repotting_interval_days: plant.repottingIntervalDays,
    adopted_at: plant.adoptedAt,
    last_watered_at: plant.lastWateredAt,
    next_watering_date: plant.nextWateringDate,
    light_demand_code: plant.lightDemandCode,
    water_cycle_code: plant.waterCycleCode,
    temperature_code: plant.temperatureCode,
    humidity_code: plant.humidityCode,
    created_at: plant.createdAt,
    updated_at: plant.updatedAt,
  }
}

// DB format (snake_case) to Plant (camelCase)
export const fromDbFormat = (data: any): Plant => {
  return {
    id: data.id,
    userId: data.user_id,
    cntntsNo: data.cntnts_no,
    commonName: data.common_name,
    scientificName: data.scientific_name,
    defaultImageUrl: data.default_image_url,
    coverImageUrl: data.cover_image_url,
    nickname: data.nickname,
    wateringIntervalDays: data.watering_interval_days,
    fertilizerIntervalDays: data.fertilizer_interval_days,
    repottingIntervalDays: data.repotting_interval_days,
    adoptedAt: data.adopted_at,
    lastWateredAt: data.last_watered_at,
    nextWateringDate: data.next_watering_date,
    lightDemandCode: data.light_demand_code,
    waterCycleCode: data.water_cycle_code,
    temperatureCode: data.temperature_code,
    humidityCode: data.humidity_code,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  }
}

import type { Plant, PlantData } from '@/types/plant'
import { toDbFormat, fromDbFormat, prepareCardForInsert } from '@/utils/plant'
import { supabase, getCurrentUserId } from './supabaseClient'

const TABLE_NAME = 'plants'
const STORAGE_BUCKET = 'plant-images'

// Add new card
export const addCard = async (plantData: PlantData): Promise<Plant> => {
  const userId = await getCurrentUserId()

  // If user uploaded an image, upload to Storage first
  let coverImageUrl = plantData.image
  if (plantData.uploadedImage) {
    coverImageUrl = await uploadPlantImage(plantData.uploadedImage, userId)
  }

  // Prepare data with uploaded image URL
  const plantToInsert = prepareCardForInsert({ ...plantData, image: coverImageUrl }, userId)
  const dbPlant = toDbFormat(plantToInsert)

  const { data, error } = await supabase.from(TABLE_NAME).insert(dbPlant).select().single()

  if (error) throw error
  return fromDbFormat(data)
}

// Get user's plants
export const getPlants = async (): Promise<Plant[]> => {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data.map(fromDbFormat)
}

// Upload plant image to Supabase Storage
const uploadPlantImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data, error } = await supabase.storage.from(STORAGE_BUCKET).upload(fileName, file, {
    cacheControl: '3600',
    upsert: false,
  })

  if (error) throw error

  // Get public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(data.path)

  return publicUrl
}

//닉네임 변경
export const updatePlantNickname = async (id: string, nickname: string): Promise<Plant> => {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({ nickname })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return fromDbFormat(data)
}

//주기 변경
export const updatePlantIntervals = async (params: {
  id: string
  wateringDays: number
  fertilizerDays: number
  repottingDays: number
}): Promise<Plant> => {
  const userId = await getCurrentUserId()
  const { id, wateringDays, fertilizerDays, repottingDays } = params

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      watering_interval_days: wateringDays,
      fertilizer_interval_days: fertilizerDays,
      repotting_interval_days: repottingDays,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return fromDbFormat(data)
}

//물 준 날짜 업데이트
export const updateWateredAt = async (id: string, lastWateredAt: string): Promise<Plant> => {
  const userId = await getCurrentUserId()

  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update({
      last_watered_at: lastWateredAt,
    })
    .eq('id', id)
    .eq('user_id', userId)
    .select('*')
    .single()

  if (error) throw error
  return fromDbFormat(data)
}

//카드 삭제
export const deletePlant = async (id: string): Promise<string> => {
  const userId = await getCurrentUserId()

  const { error } = await supabase.from(TABLE_NAME).delete().eq('id', id).eq('user_id', userId)

  if (error) throw error
  return id
}

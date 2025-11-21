import type { Plant, PlantData } from '@/types/plant'
import { toDbFormat, fromDbFormat, prepareCardForInsert } from '@/utils/plant'
import { toDateOnlyISO, addDays } from '@/utils/date'
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

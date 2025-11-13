import { createClient, type AuthResponse } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const signInWithPassword = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  })
}

export const signUp = async (
  email: string,
  password: string,
  name: string
): Promise<AuthResponse> => {
  return await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
    },
  })
}

export const getCurrentUserId = async (): Promise<string> => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('인증되지 않은 유저입니다.')
  }

  return user.id
}

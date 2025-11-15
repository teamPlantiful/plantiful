import { create } from 'zustand';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/app/apis/supabaseClient';

// 계정 상태 인터페이스 정의
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  checkSession: () => Promise<void>;
  signOut: () => Promise<void>;
}

// 계정 상태 관련 함수
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),

  // 게정 상태 체크
  checkSession: async () => {
    set({ loading: true });
    const { data, error } = await supabase.auth.getSession();
    if (error) console.error(error);
    set({
      user: data?.session?.user ?? null,
      session: data?.session ?? null,
      loading: false,
    });
  },

  // 계정 로그아웃
  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null });
  },
}));
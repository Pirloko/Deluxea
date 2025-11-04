import { create } from 'zustand'
import { supabase, UserRole } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'

interface UserData {
  id: string
  email: string
  role: UserRole
  is_active: boolean
  must_change_password: boolean
}

interface AuthState {
  user: User | null
  userData: UserData | null
  loading: boolean
  showChangePasswordModal: boolean
  
  // Actions
  initialize: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string, acceptTerms: boolean) => Promise<void>
  logout: () => Promise<void>
  changePassword: (newPassword: string) => Promise<void>
  fetchUserData: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  userData: null,
  loading: true,
  showChangePasswordModal: false,

  initialize: async () => {
    try {
      // Verificar sesión actual
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        set({ user: session.user })
        await get().fetchUserData()
      }

      // Escuchar cambios de autenticación
      supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          set({ user: session.user })
          await get().fetchUserData()
        } else {
          set({ user: null, userData: null })
        }
      })
    } catch (error) {
      console.error('Error inicializando auth:', error)
    } finally {
      set({ loading: false })
    }
  },

  fetchUserData: async () => {
    const { user } = get()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error

      set({ 
        userData: data,
        showChangePasswordModal: data.must_change_password 
      })
    } catch (error) {
      console.error('Error obteniendo datos de usuario:', error)
    }
  },

  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    set({ user: data.user })
    await get().fetchUserData()
  },

  register: async (email: string, password: string, acceptTerms: boolean) => {
    if (!acceptTerms) {
      throw new Error('Debes aceptar que eres mayor de edad')
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) throw error

    // Crear registro en tabla users con rol visitor
    if (data.user) {
      const { error: insertError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email!,
          role: 'visitor',
          is_active: true,
          must_change_password: false,
        })

      if (insertError) throw insertError
    }

    set({ user: data.user })
    await get().fetchUserData()
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null, userData: null })
  },

  changePassword: async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    // Actualizar flag de cambio de contraseña
    const { user } = get()
    if (user) {
      await supabase
        .from('users')
        .update({ must_change_password: false })
        .eq('id', user.id)

      set({ showChangePasswordModal: false })
      await get().fetchUserData()
    }
  },
}))


import AsyncStorage from "@react-native-async-storage/async-storage"
import { createClient } from "@supabase/supabase-js"
import { Platform } from "react-native"
import Constants from "expo-constants"

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 
  Constants.expoConfig?.extra?.supabaseUrl || 
  "https://rzdqfjqxkgcyekilvrid.supabase.co"

const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 
  Constants.expoConfig?.extra?.supabaseAnonKey || 
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6ZHFmanF4a2djeWVraWx2cmlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NzYzNDQsImV4cCI6MjA4MDI1MjM0NH0._EPl-l1NnU8BcSonbxr_qR7w4JiYwECGRQKu4bQHEuo"

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[Supabase] Missing credentials:', { 
    hasUrl: !!supabaseUrl, 
    hasKey: !!supabaseAnonKey 
  })
}

console.log('[Supabase] Initializing with URL:', supabaseUrl)

const supabaseStorage = {
  getItem: async (key: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return null
      }
      return localStorage.getItem(key)
    }
    return AsyncStorage.getItem(key)
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return
      }
      localStorage.setItem(key, value)
    } else {
      AsyncStorage.setItem(key, value)
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === "web") {
      if (typeof localStorage === "undefined") {
        return
      }
      localStorage.removeItem(key)
    } else {
      AsyncStorage.removeItem(key)
    }
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})

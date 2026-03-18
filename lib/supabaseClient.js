import { createClient } from '@supabase/supabase-js'

const STORAGE_KEY =
  process.env.NEXT_PUBLIC_AUTH_CONFIG_STORAGE_KEY || 'demo-auth-config'

function readConfigFromStorage() {
  // localStorage only exists in the browser.
  if (typeof window === 'undefined') {
    return null
  }

  const savedConfig = window.localStorage.getItem(STORAGE_KEY)

  if (!savedConfig) {
    return null
  }

  try {
    return JSON.parse(savedConfig)
  } catch {
    // If the saved JSON is broken, ignore it and fall back to env values.
    return null
  }
}

function getRuntimeConfig() {
  const storedConfig = readConfigFromStorage()

  // Use what the user saved on the Configuration page first.
  // If nothing was saved yet, use .env.local values as the fallback.
  return {
    supabaseUrl:
      storedConfig?.supabaseUrl || process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    supabaseAnonKey:
      storedConfig?.supabaseAnonKey ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      '',
    googleClientId:
      storedConfig?.googleClientId || process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  }
}

export function getSupabaseClient() {
  const { supabaseUrl, supabaseAnonKey } = getRuntimeConfig()

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      'Missing Supabase URL or Anon Key. Add them in .env.local or save them on /config first.'
    )
  }

  // Create a fresh client using the latest saved configuration.
  return createClient(supabaseUrl, supabaseAnonKey)
}

export function getSavedAuthConfig() {
  return getRuntimeConfig()
}

export function saveAuthConfig(config) {
  if (typeof window === 'undefined') {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(config))
}

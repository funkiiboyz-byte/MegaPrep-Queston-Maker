import { createClient } from '@supabase/supabase-js'

// Read the values from environment variables.
// The NEXT_PUBLIC_ prefix is required because this client will run in the browser.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Create one reusable Supabase client for the browser.
// Exporting a single instance lets us import it anywhere in our UI code.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

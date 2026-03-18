'use client'

import { useState } from 'react'
import { getSavedAuthConfig, getSupabaseClient } from '../../lib/supabaseClient'

export default function LoginPage() {
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    setMessage('Opening Google sign-in...')

    try {
      const config = getSavedAuthConfig()
      const supabase = getSupabaseClient()

      // Start the Google OAuth flow through Supabase.
      // If the user does not already exist, Supabase creates the account automatically.
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/login`,
        },
      })

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      setMessage(
        config.googleClientId
          ? 'Redirecting with your saved Supabase + Google configuration.'
          : 'Redirecting with your saved Supabase configuration.'
      )
    } catch (error) {
      setMessage(error.message)
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <section className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-400">
            Simple Supabase Auth
          </p>
          <h1 className="mt-3 text-3xl font-bold">Login / Signup with Google</h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            With Google OAuth, one big button can handle both login and signup.
          </p>
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white px-5 py-4 text-base font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-lg font-bold">
            G
          </span>
          {loading ? 'Please wait...' : 'Sign in with Google'}
        </button>

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
          <p className="font-semibold text-white">Before you click the button:</p>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>Open <span className="font-semibold text-emerald-300">/config</span>.</li>
            <li>Save your Supabase URL and Anon Key.</li>
            <li>Enable Google inside the Supabase dashboard.</li>
            <li>Paste the Supabase callback URL into Google Cloud Console.</li>
          </ol>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="/config"
            className="rounded-2xl border border-slate-700 px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-400"
          >
            Open Configuration Page
          </a>
        </div>

        {message ? (
          <p className="mt-6 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  )
}

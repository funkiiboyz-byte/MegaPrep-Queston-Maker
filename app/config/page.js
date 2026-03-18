'use client'

import { useEffect, useState } from 'react'
import { getSavedAuthConfig, saveAuthConfig } from '../../lib/supabaseClient'

export default function ConfigPage() {
  const [supabaseUrl, setSupabaseUrl] = useState('')
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('')
  const [googleClientId, setGoogleClientId] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Load the current saved settings when the page opens.
    const config = getSavedAuthConfig()
    setSupabaseUrl(config.supabaseUrl)
    setSupabaseAnonKey(config.supabaseAnonKey)
    setGoogleClientId(config.googleClientId)
  }, [])

  function handleSave() {
    saveAuthConfig({
      supabaseUrl,
      supabaseAnonKey,
      googleClientId,
    })

    setMessage('Saved! Your Login page will now use these values.')
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-400">
            Admin Style Configuration Page
          </p>
          <h1 className="mt-3 text-3xl font-bold">Authentication Settings</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Paste your Supabase and Google values here. When you click save, they are
            stored in your browser and the Login page will read them automatically.
          </p>
        </div>

        <div className="grid gap-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Supabase URL
            </label>
            <input
              value={supabaseUrl}
              onChange={(event) => setSupabaseUrl(event.target.value)}
              placeholder="https://your-project-ref.supabase.co"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Supabase Anon Key
            </label>
            <textarea
              value={supabaseAnonKey}
              onChange={(event) => setSupabaseAnonKey(event.target.value)}
              placeholder="Paste your public anon key here"
              rows={5}
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">
              Google Client ID
            </label>
            <input
              value={googleClientId}
              onChange={(event) => setGoogleClientId(event.target.value)}
              placeholder="Paste your Google Client ID here"
              className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-emerald-400"
            />
            <p className="mt-2 text-sm text-slate-500">
              Supabase Google login mainly uses the Supabase provider setup. We keep the
              Google Client ID here because beginners often want one place to see all the
              values they configured.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-2xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400"
          >
            Save Configuration
          </button>

          <a
            href="/login"
            className="rounded-2xl border border-slate-700 px-6 py-3 text-sm font-semibold text-white transition hover:border-emerald-400"
          >
            Go to Login Page
          </a>
        </div>

        {message ? (
          <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
            {message}
          </p>
        ) : null}
      </section>
    </main>
  )
}

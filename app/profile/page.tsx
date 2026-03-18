'use client'

import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

export default function ProfilePage() {
  // Keep the current auth session in state so the UI can react to login/logout.
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadSession() {
      // Read the current session when the page first loads.
      const {
        data: { session },
      } = await supabase.auth.getSession()

      setSession(session)
      setLoading(false)
    }

    loadSession()

    // Listen for future auth changes, such as login, logout, or token refresh.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    // Cleanup prevents memory leaks when the component unmounts.
    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setSession(null)
  }

  const user = session?.user
  const displayName =
    user?.user_metadata?.full_name || user?.user_metadata?.name || 'Anonymous User'

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold">Your Session</h1>
        <p className="mt-2 text-slate-400">
          This page shows how to tell whether a user is signed in.
        </p>

        {loading ? <p className="mt-6">Loading session...</p> : null}

        {!loading && !user ? (
          <div className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
            No user is logged in right now.
          </div>
        ) : null}

        {!loading && user ? (
          <div className="mt-6 space-y-4 rounded-xl border border-slate-800 bg-slate-950 p-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Name</p>
              <p className="mt-1 text-lg font-semibold">{displayName}</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Email</p>
              <p className="mt-1 text-lg font-semibold">{user.email}</p>
            </div>

            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-500">User ID</p>
              <p className="mt-1 break-all text-sm text-slate-300">{user.id}</p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-400"
            >
              Log out
            </button>
          </div>
        ) : null}
      </section>
    </main>
  )
}

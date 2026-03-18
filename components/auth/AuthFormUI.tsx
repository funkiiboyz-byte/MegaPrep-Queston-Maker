'use client'

import Link from 'next/link'

type AuthFormUIProps = {
  title: string
  submitLabel: string
  mode: 'login' | 'signup'
  email: string
  password: string
  loading: boolean
  message: string
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  onGoogleSignIn: () => void
}

export function AuthFormUI({
  title,
  submitLabel,
  mode,
  email,
  password,
  loading,
  message,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onGoogleSignIn,
}: AuthFormUIProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-emerald-400">
            Beginner Auth Demo
          </p>
          <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Use email/password or Google to continue.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoogleSignIn}
          disabled={loading}
          className="mb-4 flex w-full items-center justify-center gap-3 rounded-xl border border-slate-700 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-base">G</span>
          Sign in with Google
        </button>

        <div className="mb-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-800" />
          <span className="text-xs uppercase tracking-[0.3em] text-slate-500">or</span>
          <div className="h-px flex-1 bg-slate-800" />
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => onEmailChange(event.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => onPasswordChange(event.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none ring-0 placeholder:text-slate-500 focus:border-emerald-400"
            />
          </div>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="w-full rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Please wait...' : submitLabel}
          </button>
        </div>

        {message ? (
          <p className="mt-4 rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-300">
            {message}
          </p>
        ) : null}

        <p className="mt-6 text-center text-sm text-slate-400">
          {mode === 'login' ? 'Need an account?' : 'Already have an account?'}{' '}
          <Link
            href={mode === 'login' ? '/signup' : '/login'}
            className="font-semibold text-emerald-400 hover:text-emerald-300"
          >
            {mode === 'login' ? 'Create one here' : 'Go to login'}
          </Link>
        </p>
      </section>
    </main>
  )
}

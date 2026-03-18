'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthFormUI } from '@/components/auth/AuthFormUI'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  // Store the form values in React state so the inputs stay in sync with the UI.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  // Next.js router lets us move the user to another page after login.
  const router = useRouter()

  async function handleGoogleSignIn() {
    setLoading(true)
    setMessage('Redirecting to Google...')

    // Start the OAuth flow with Google.
    // Supabase will redirect the user to Google's login page.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // After the Google flow finishes, send the user back to this page.
        // In a real app, you might choose /dashboard instead.
        redirectTo: `${window.location.origin}/profile`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }
  }

  async function handleEmailLogin() {
    setLoading(true)
    setMessage('Signing you in...')

    // Attempt a password-based login using the form values.
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Login successful!')
    setLoading(false)

    // Move the user to a protected/profile page after success.
    router.push('/profile')
  }

  return (
    <AuthFormUI
      title="Welcome back"
      submitLabel="Login with Email"
      mode="login"
      email={email}
      password={password}
      loading={loading}
      message={message}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleEmailLogin}
      onGoogleSignIn={handleGoogleSignIn}
    />
  )
}

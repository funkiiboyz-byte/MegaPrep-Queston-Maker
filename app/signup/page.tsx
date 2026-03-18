'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthFormUI } from '@/components/auth/AuthFormUI'
import { supabase } from '@/lib/supabaseClient'

export default function SignupPage() {
  // These pieces of state track user input and helpful feedback messages.
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  async function handleGoogleSignIn() {
    setLoading(true)
    setMessage('Redirecting to Google...')

    // Even on a signup page, Google OAuth starts with the same method.
    // If the Google account is new, Supabase creates the user automatically.
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/profile`,
      },
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }
  }

  async function handleEmailSignup() {
    setLoading(true)
    setMessage('Creating your account...')

    // Create a new user with email and password.
    // Depending on your Supabase settings, the user may need to confirm their email.
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      setLoading(false)
      return
    }

    setMessage('Signup successful! Check your email if confirmation is enabled.')
    setLoading(false)

    // Route the user to the profile page or back to login.
    router.push('/profile')
  }

  return (
    <AuthFormUI
      title="Create your account"
      submitLabel="Sign Up with Email"
      mode="signup"
      email={email}
      password={password}
      loading={loading}
      message={message}
      onEmailChange={setEmail}
      onPasswordChange={setPassword}
      onSubmit={handleEmailSignup}
      onGoogleSignIn={handleGoogleSignIn}
    />
  )
}

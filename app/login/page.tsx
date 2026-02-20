'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    const redirectTo = `${window.location.origin}/auth/callback?next=%2Fshop%2Fedit`
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo
      }
    })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email for the magic link.')
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">Login / Sign Up</h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          Send Magic Link
        </button>
      </form>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  )
}

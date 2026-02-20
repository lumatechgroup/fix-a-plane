'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleAuth = async (e) => {
    e.preventDefault()
    let result
    if (isSignUp) {
      result = await supabase.auth.signUp({ email, password })
    } else {
      result = await supabase.auth.signInWithPassword({ email, password })
    }
    if (result.error) {
      setMessage(result.error.message)
    } else {
      if (isSignUp) {
        setMessage('Check your email for verification link.')
      } else {
        router.push('/shop/edit')
      }
    }
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl mb-4">{isSignUp ? 'Sign Up' : 'Login'}</h1>
      <form onSubmit={handleAuth} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full p-2 border"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border"
          required
        />
        <button type="submit" className="bg-blue-500 text-white p-2 w-full">
          {isSignUp ? 'Sign Up' : 'Login'}
        </button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-blue-500">
        {isSignUp ? 'Switch to Login' : 'Switch to Sign Up'}
      </button>
      {message && <p className="mt-4 text-red-500">{message}</p>}
    </div>
  )
}
// Dummy comment to trigger deploy
<h1>Test Update - Ignore Me (Deploy Check)</h1>

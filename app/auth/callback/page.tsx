'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verify = async () => {
      const token_hash = searchParams.get('token_hash')
      const type = searchParams.get('type')
      const next = searchParams.get('next') || '/shop/edit'

      if (token_hash && type) {
        const { data, error } = await supabase.auth.verifyOtp({ token_hash, type })
        if (error) {
          console.error(error)
          router.push('/login?error=Verification failed')
        } else {
          router.push(next)
        }
      } else {
        router.push('/login?error=Invalid callback')
      }
    }
    verify()
  }, [router, searchParams])

  return <div>Verifying...</div>
}

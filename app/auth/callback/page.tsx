'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../../../lib/supabase'
import { EmailOtpType } from '@supabase/supabase-js'

function CallbackContent() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const token_hash = searchParams.get('token_hash')
    const type = searchParams.get('type') as EmailOtpType

    if (token_hash && type) {
      supabase.auth.verifyOtp({ token_hash, type })
    }
  }, [searchParams])

  return <div>Authenticating...</div>
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CallbackContent />
    </Suspense>
  )
}
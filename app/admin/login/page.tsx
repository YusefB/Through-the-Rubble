'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

/**
 * Admin login page. Supports two modes:
 *  1. Email + password via supabase.auth.signInWithPassword
 *  2. Magic link via supabase.auth.signInWithOtp (toggled with the
 *     "Magic link?" button)
 *
 * The signed-in session uses Supabase's default cookie storage via @supabase/ssr.
 */
export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [useMagicLink, setUseMagicLink] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setMagicLinkSent(false)
    setSubmitting(true)

    try {
      const supabase = createSupabaseBrowserClient()

      if (useMagicLink) {
        const { error: otpError } = await supabase.auth.signInWithOtp({
          email,
        })
        if (otpError) {
          setError(otpError.message)
        } else {
          setMagicLinkSent(true)
        }
      } else {
        const { error: pwError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (pwError) {
          setError(pwError.message)
        } else {
          router.push('/admin')
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: '100%',
          maxWidth: 360,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: '#161616',
          padding: 24,
          borderRadius: 8,
          border: '1px solid rgba(206,17,38,0.25)',
        }}
        aria-label="Admin sign in"
      >
        <h1 style={{ fontSize: 18, margin: 0 }}>Admin sign in</h1>

        <label
          style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13 }}
        >
          Email
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            style={{
              padding: '10px 12px',
              borderRadius: 6,
              border: '1px solid #4a4a4a',
              background: '#000000',
              color: '#ffffff',
              fontSize: 15,
            }}
          />
        </label>

        {!useMagicLink && (
          <label
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              fontSize: 13,
            }}
          >
            Password
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!useMagicLink}
              autoComplete="current-password"
              style={{
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid #4a4a4a',
                background: '#000000',
                color: '#ffffff',
                fontSize: 15,
              }}
            />
          </label>
        )}

        <button
          type="submit"
          disabled={submitting}
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            border: 'none',
            background: '#ffffff',
            color: '#000000',
            fontSize: 15,
            fontWeight: 600,
            cursor: submitting ? 'wait' : 'pointer',
          }}
        >
          {submitting
            ? 'Working…'
            : useMagicLink
              ? 'Send magic link'
              : 'Sign in'}
        </button>

        <button
          type="button"
          onClick={() => {
            setUseMagicLink((v) => !v)
            setError(null)
            setMagicLinkSent(false)
          }}
          style={{
            background: 'transparent',
            color: '#a0a0a0',
            border: 'none',
            fontSize: 13,
            cursor: 'pointer',
            textAlign: 'center',
            padding: 0,
            textDecoration: 'underline',
          }}
        >
          {useMagicLink ? 'Use password instead' : 'Magic link?'}
        </button>

        {error ? (
          <p
            role="alert"
            style={{ color: '#ff8888', fontSize: 13, margin: 0 }}
          >
            {error}
          </p>
        ) : null}

        {magicLinkSent ? (
          <p
            role="status"
            style={{ color: '#88dd88', fontSize: 13, margin: 0 }}
          >
            Check your email
          </p>
        ) : null}
      </form>
    </div>
  )
}

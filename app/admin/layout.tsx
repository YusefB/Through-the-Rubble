import type { ReactNode } from 'react'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { signOutAction } from '@/lib/admin/actions'

/**
 * Admin shell layout. Server component that performs the auth gate before
 * any admin page renders.
 *
 * The signed-in session uses Supabase's default cookie storage via @supabase/ssr.
 * If the user is unauthenticated and not already on /admin/login, we redirect
 * them to the login page.
 */
export default async function AdminLayout({
  children,
}: {
  children: ReactNode
}) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // We need to know the current pathname so we can avoid a redirect loop on
  // /admin/login. Next.js exposes the request URL via the `x-invoke-path` /
  // referer headers; we fall back to checking against /admin/login both ways.
  const requestHeaders = await headers()
  const pathname =
    requestHeaders.get('x-invoke-path') ??
    requestHeaders.get('x-pathname') ??
    requestHeaders.get('next-url') ??
    ''

  const isLoginPage = pathname.startsWith('/admin/login')

  if (!user && !isLoginPage) {
    redirect('/admin/login')
  }

  // On the login page, render children without the chrome (lets the login
  // form take the whole viewport on mobile).
  if (isLoginPage) {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: '#000000',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#000000',
        color: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          borderBottom: '1px solid rgba(206,17,38,0.25)',
          gap: 12,
        }}
      >
        <h1 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>
          Through the Rubble — Admin
        </h1>
        <form action={signOutAction}>
          <button
            type="submit"
            style={{
              background: 'transparent',
              color: '#ffffff',
              border: '1px solid #4a4a4a',
              borderRadius: 6,
              padding: '6px 12px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        </form>
      </header>
      <main style={{ flex: 1, padding: 16 }}>{children}</main>
    </div>
  )
}

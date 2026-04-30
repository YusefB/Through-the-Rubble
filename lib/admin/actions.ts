'use server'

import { redirect } from 'next/navigation'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Sign the current user out and redirect to /admin/login.
 *
 * The signed-in session uses Supabase's default cookie storage via @supabase/ssr;
 * the server client wired in lib/supabase/server.ts handles cookie clearing.
 */
export async function signOutAction() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Admin dashboard. Shows three stat cards (scenes / stories / hotspots) and
 * a list of links to the main admin sections.
 *
 * Counts may be 0 until admin RLS policies are added — see TODO(admin-rls)
 * in app/admin/scenes/page.tsx.
 */
export default async function AdminDashboardPage() {
  const supabase = await createSupabaseServerClient()

  const [scenesRes, storiesRes, hotspotsRes] = await Promise.all([
    supabase.from('scenes').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('hotspots').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Scenes', count: scenesRes.count ?? 0 },
    { label: 'Stories', count: storiesRes.count ?? 0 },
    { label: 'Hotspots', count: hotspotsRes.count ?? 0 },
  ]

  const links = [
    { href: '/admin/scenes', label: 'Scenes' },
    { href: '/admin/stories', label: 'Stories' },
    { href: '/admin/sources', label: 'Sources' },
    { href: '/admin/logs', label: 'Logs' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <h2 style={{ fontSize: 20, margin: 0 }}>Dashboard</h2>

      <div className="admin-stat-grid">
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: '#161616',
              border: '1px solid rgba(206,17,38,0.25)',
              borderRadius: 8,
              padding: 16,
            }}
          >
            <div style={{ fontSize: 12, color: '#a0a0a0', marginBottom: 8 }}>
              {s.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 700 }}>{s.count}</div>
          </div>
        ))}
      </div>

      <nav aria-label="Admin sections">
        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                style={{
                  display: 'block',
                  padding: '12px 16px',
                  background: '#161616',
                  border: '1px solid rgba(206,17,38,0.25)',
                  borderRadius: 8,
                  color: '#ffffff',
                  textDecoration: 'none',
                }}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <style>
        {`
          .admin-stat-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 12px;
          }
          @media (min-width: 768px) {
            .admin-stat-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `}
      </style>
    </div>
  )
}

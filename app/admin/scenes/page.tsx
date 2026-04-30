import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Admin scene list. Renders all rows the authenticated user is allowed to read.
 *
 * TODO(admin-rls): Admin RLS policies are deferred to a later sub-project.
 * Until then, even authenticated admins only see rows where is_published = true
 * (the default public read policy). When the admin role + policies land,
 * unpublished drafts will appear here too.
 */
export default async function AdminScenesPage() {
  const supabase = await createSupabaseServerClient()

  const { data: scenes, error } = await supabase
    .from('scenes')
    .select('id, title, slug, language, is_published, updated_at')
    .order('updated_at', { ascending: false })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ fontSize: 20, margin: 0 }}>Scenes</h2>
        <Link
          href="/admin"
          style={{ color: '#a0a0a0', fontSize: 13, textDecoration: 'underline' }}
        >
          Back to dashboard
        </Link>
      </div>

      {error ? (
        <p role="alert" style={{ color: '#ff8888', fontSize: 13 }}>
          Failed to load scenes: {error.message}
        </p>
      ) : null}

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: 13,
            minWidth: 560,
          }}
        >
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2a2a' }}>
              <th style={cellStyle}>Title</th>
              <th style={cellStyle}>Slug</th>
              <th style={cellStyle}>Language</th>
              <th style={cellStyle}>Published</th>
              <th style={cellStyle}>Updated</th>
            </tr>
          </thead>
          <tbody>
            {(scenes ?? []).map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid #1a1a1a' }}>
                <td style={cellStyle}>
                  <Link
                    href={`/admin/scenes/${s.id}`}
                    style={{
                      color: '#f5ebd8',
                      textDecoration: 'underline',
                    }}
                  >
                    {s.title}
                  </Link>
                </td>
                <td style={{ ...cellStyle, color: '#a0a0a0' }}>{s.slug}</td>
                <td style={{ ...cellStyle, color: '#a0a0a0' }}>{s.language}</td>
                <td style={cellStyle}>{s.is_published ? 'Yes' : 'No'}</td>
                <td style={{ ...cellStyle, color: '#a0a0a0' }}>
                  {new Date(s.updated_at).toLocaleString()}
                </td>
              </tr>
            ))}
            {(scenes ?? []).length === 0 && !error ? (
              <tr>
                <td
                  colSpan={5}
                  style={{ ...cellStyle, color: '#a0a0a0', fontStyle: 'italic' }}
                >
                  No scenes visible. (RLS may be hiding unpublished rows — see
                  TODO(admin-rls) in code.)
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const cellStyle = {
  padding: '10px 12px',
  textAlign: 'left' as const,
  verticalAlign: 'top' as const,
}

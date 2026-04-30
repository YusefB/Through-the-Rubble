import Link from 'next/link'

/**
 * Placeholder editor page for an individual scene.
 * Full editor lands in a later sub-project.
 */
export default async function AdminSceneEditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ fontSize: 20, margin: 0 }}>Scene editor</h2>
        <Link
          href="/admin/scenes"
          style={{ color: '#a0a0a0', fontSize: 13, textDecoration: 'underline' }}
        >
          Back to scenes
        </Link>
      </div>
      <p>Scene editor coming soon. ID: {id}</p>
    </div>
  )
}

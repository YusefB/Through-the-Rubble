'use client'
type Props = {
  chapterId: string
  scrollAnchorY: number
}

export function ChapterAnchor({ chapterId, scrollAnchorY }: Props) {
  return (
    <div
      data-testid={`chapter-anchor-${chapterId}`}
      data-chapter={chapterId}
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: `${scrollAnchorY * 100}%`,
        left: 0,
        width: '100%',
        height: '1px',
        visibility: 'hidden',
        pointerEvents: 'none',
      }}
    />
  )
}

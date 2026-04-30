'use client'
import Image from 'next/image'
import { motion } from 'motion/react'
import type { SceneImage, ParallaxLayer as ParallaxData } from '@/lib/scene/types'
import { useSceneStore } from '@/lib/scene/SceneStoreContext'

type MasterProps = {
  image: SceneImage
  priority?: boolean
}

export function MasterLayer({ image, priority = false }: MasterProps) {
  const beforeAfter = useSceneStore((s) => s.beforeAfter)
  const reducedMotion = useSceneStore((s) => s.reducedMotion)
  const isVisible = beforeAfter === image.variant

  return (
    <motion.div
      data-testid={`master-layer-${image.variant}`}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.6, ease: 'easeOut' }}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: isVisible ? 1 : 0,
      }}
    >
      <Image
        src={image.url}
        alt={image.altText}
        fill
        priority={priority}
        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 800px"
        {...(image.blurDataUrl
          ? { placeholder: 'blur' as const, blurDataURL: image.blurDataUrl }
          : {})}
        style={{ objectFit: 'cover' }}
      />
    </motion.div>
  )
}

type ParallaxProps = {
  layer: ParallaxData
  reduced?: boolean
}

export function ParallaxLayer({ layer, reduced = false }: ParallaxProps) {
  if (reduced) return null
  return (
    <div
      data-testid={`parallax-layer-${layer.id}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: layer.opacity ?? 1,
        mixBlendMode: layer.blendMode ?? 'normal',
        pointerEvents: 'none',
      }}
    >
      <Image src={layer.url} alt="" role="presentation" fill style={{ objectFit: 'cover' }} />
    </div>
  )
}

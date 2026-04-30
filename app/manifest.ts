import type { MetadataRoute } from 'next'

/**
 * PWA manifest for the admin shell. The start_url points at /admin so
 * "Add to Home Screen" lands directly on the dashboard.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Through the Rubble Admin',
    short_name: 'TtR Admin',
    start_url: '/admin',
    display: 'standalone',
    background_color: '#000000',
    theme_color: '#000000',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '256x256',
        type: 'image/x-icon',
      },
    ],
  }
}

export default function manifest() {
  return {
    name: 'Vitrina - Το κατάστημά σας',
    short_name: 'Vitrina',
    description: 'Βιτρίνα προϊόντων για το κατάστημά σας',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#1e40af',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}

import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'https://studyflow-red-nu.vercel.app'
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/dashboard', '/sessions', '/routines', '/statistics', '/settings'] },
    sitemap: `${base}/sitemap.xml`,
  }
}

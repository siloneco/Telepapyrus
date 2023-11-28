import { MetadataRoute } from 'next'

export const dynamic = 'force-static'

const baseUrl = process.env.BASE_URL || ''

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      disallow: ['/api/', '/admin/'],
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

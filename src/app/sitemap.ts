import { MetadataRoute } from 'next'
import { getRepository } from '@/layers/repository/ArticleRepository'
import { ArticleOverview } from '@/layers/entity/types'
import NodeCache from 'node-cache'

const cache = new NodeCache()
const cacheTTL = 60

export const dynamic = 'force-dynamic'

const baseUrl = process.env.BASE_URL || ''

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const cachedData = cache.get<MetadataRoute.Sitemap>('key')

  if (cachedData) {
    return cachedData
  }

  const sitemapData: MetadataRoute.Sitemap = []

  const result = await getRepository().listArticle({})
  if (!result.success) {
    throw new Error(`Failed to list article: ${result.error?.message}`)
  }

  const data: ArticleOverview[] = result.data!

  const currentTime: number = new Date().getTime()
  for (const result of data) {
    let changeFreq:
      | 'daily'
      | 'always'
      | 'hourly'
      | 'weekly'
      | 'monthly'
      | 'yearly'
      | 'never' = 'daily'

    if (currentTime - result.date.getTime() > 86400000 * 30) {
      // a month passed since last update
      changeFreq = 'monthly'
    } else if (currentTime - result.date.getTime() > 86400000 * 7) {
      // a week passed since last update
      changeFreq = 'weekly'
    } else {
      changeFreq = 'daily'
    }

    if (sitemapData.length === 0) {
      sitemapData.push({
        url: baseUrl,
        lastModified: result.date,
        changeFrequency: changeFreq,
        priority: 1,
      })
    }

    sitemapData.push({
      url: `${baseUrl}/article/${result.id}`,
      lastModified: result.date,
      changeFrequency: changeFreq,
      priority: 0.5,
    })
  }

  cache.set('key', sitemapData, cacheTTL)
  return sitemapData
}

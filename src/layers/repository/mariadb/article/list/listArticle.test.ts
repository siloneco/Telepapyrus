import getConnectionPool from '../../connection/getConnectionPool'
import { listArticle } from './listArticle'

const checkTypes = (articles: any[] | undefined) => {
  expect(articles).toBeInstanceOf(Array)
  expect(articles?.length).toBeGreaterThan(0)

  for (const article of articles!) {
    expect(article).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      description: expect.any(String),
      tags: expect.any(Array),
      isPublic: expect.any(Boolean),
      date: expect.any(Date),
    })

    if (article.date !== null) {
      expect(article.date).toBeInstanceOf(Date)
    }

    for (const tag of article.tags) {
      expect(typeof tag).toBe('string')
    }
  }
}

describe('listArticle', () => {
  it('gets all articles correctly', async () => {
    const returnedValue = await listArticle({})

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const articles = returnedValue.data

    checkTypes(articles)
  })

  it('gets articles correctly by specifying tags', async () => {
    const tagName = 'test-article-list-success-specific-tag'
    const returnedValue = await listArticle({ tags: [tagName], page: 1 })

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const articles = returnedValue.data

    checkTypes(articles)

    for (const article of articles!) {
      expect(article.tags).toContain(tagName)
    }
  })

  it('gets correct amount of articles by specifying page', async () => {
    const amount = 10
    const returnedValue = await listArticle({ page: 1 })

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const articles = returnedValue.data

    checkTypes(articles)

    expect(articles?.length).toBeLessThanOrEqual(amount)
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})

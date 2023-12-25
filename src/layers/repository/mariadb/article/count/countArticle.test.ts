import getConnectionPool from '../../connection/getConnectionPool'
import { countArticle } from './countArticle'

describe('countArticle', () => {
  it('counts articles correctly', async () => {
    const returnedValue = await countArticle()

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const count = returnedValue.data

    expect(typeof count).toBe('number')
    expect(count).toBeGreaterThanOrEqual(0)
  })

  it('counts articles correctly when a tag specified', async () => {
    const returnedValue = await countArticle([
      'test-article-count-success-specific-tag-1',
    ])

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const count = returnedValue.data

    expect(typeof count).toBe('number')
    expect(count).toBe(2)
  })

  it('counts articles correctly when multiple tags specified', async () => {
    const returnedValue = await countArticle([
      'test-article-count-success-specific-tag-1',
      'test-article-count-success-specific-tag-2',
    ])

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const count = returnedValue.data

    expect(typeof count).toBe('number')
    expect(count).toBe(1)
  })

  it('returns 0 when tags not existing specified', async () => {
    const returnedValue = await countArticle([
      'test-article-count-success-not-exists',
    ])

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const count = returnedValue.data

    expect(typeof count).toBe('number')
    expect(count).toBe(0)
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})

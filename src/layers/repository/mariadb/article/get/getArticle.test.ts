jest.mock('./query')

import { PublishableDraft } from '@/layers/entity/types'
import getConnectionPool from '../../connection/getConnectionPool'
import { getArticle } from './getArticle'
import { getArticleQuery as dummyArticleQuery } from './query'

const { getArticleQuery } = jest.requireActual('./query')

const milliSec = () => {
  return new Date().getTime()
}

describe('getArticle', () => {
  beforeEach(() => {
    const getArticleQueryMock = dummyArticleQuery as jest.Mock
    getArticleQueryMock.mockReturnValue(getArticleQuery())
  })

  it('gets an article correctly', async () => {
    const draft: PublishableDraft = {
      id: `test-article-get-success`,
      title: 'title',
      description: 'description',
      content: 'content',
      tags: ['test-article-get-success-tag'],
      isPublic: false,
    }

    const fetched = (await getArticle(draft.id)).data

    expect(fetched).toMatchObject(draft)
    expect(fetched?.date).toBeInstanceOf(Date)
    expect(fetched?.last_updated).toBeInstanceOf(Date)
  })

  it('rejects when the article does not exists', async () => {
    const id = `tmp-test-article-get-fail-id-not-exists-${milliSec()}`

    expect(await getArticle(id)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more articles selected', async () => {
    const getArticleQueryMock = dummyArticleQuery as jest.Mock
    getArticleQueryMock.mockReturnValue('SELECT * from (VALUES (1), (2)) AS t;')

    const id = `tmp-test-article-get-fail-too-many-${milliSec()}}`

    expect(await getArticle(id)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-selected',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})

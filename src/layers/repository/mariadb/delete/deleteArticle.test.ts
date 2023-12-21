jest.mock('./query')

import getConnectionPool from '../connection/getConnectionPool'
import { createArticle } from '../create/createArticle'
import { deleteArticle } from './deleteArticle'
import { deleteArticleQuery as dummyDeleteArticleQuery } from './query'

const { deleteArticleQuery } = jest.requireActual('./query')

const milliSec = () => {
  return new Date().getTime() + Math.floor(Math.random() * 10000)
}

describe('deleteArticle', () => {
  beforeEach(() => {
    const dummy = dummyDeleteArticleQuery as any
    dummy.mockReturnValue(deleteArticleQuery())
  })

  it('deletes an article correctly', async () => {
    const id = `tmp-test-delete-success-${milliSec()}`

    await createArticle({
      id: id,
      title: 'title',
      content: 'content',
      tags: [],
      public: true,
    })

    expect(await deleteArticle(id)).toMatchObject({
      success: true,
    })
  })

  it('rejects when the article is not exists', async () => {
    const id = `tmp-test-delete-fail-id-not-exists-${milliSec()}`

    expect(await deleteArticle(id)).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })

  it('rejects when 2 or more articles deleted', async () => {
    const baseId = 'test-delete-fail-too-many-deleted'
    const dummy = dummyDeleteArticleQuery as any
    dummy.mockReturnValue(`DELETE FROM articles WHERE id LIKE '${baseId}-%';`)

    expect(await deleteArticle(baseId)).toMatchObject({
      success: false,
      error: {
        id: 'too-many-rows-affected',
      },
    })
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})

import getConnectionPool from '../../connection/getConnectionPool'
import { listDraft } from './listDraft'

const checkTypes = (drafts: any[] | undefined) => {
  expect(drafts).toBeInstanceOf(Array)
  expect(drafts?.length).toBeGreaterThan(0)

  for (const draftOverview of drafts!) {
    expect(draftOverview).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
    })
  }
}

describe('listDraft', () => {
  it('gets all drafts correctly', async () => {
    const returnedValue = await listDraft()

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const drafts = returnedValue.data

    checkTypes(drafts)
  })

  it('gets correct amount of drafts by specifying page', async () => {
    const amount = 10
    const returnedValue = await listDraft(1)

    expect(returnedValue).toMatchObject({
      success: true,
    })

    const drafts = returnedValue.data

    checkTypes(drafts)

    expect(drafts?.length).toBeLessThanOrEqual(amount)
  })
})

afterAll(async () => {
  const pool = await getConnectionPool()
  await pool.end()
})

import { Draft } from '@/layers/entity/types'
import { setDraftForPreview } from './setDraftForPreview'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
}

describe('setDraftForPreview', () => {
  it('holds draft correctly', async () => {
    const result = await setDraftForPreview(baseData)
    expect(result).toMatchObject({
      success: true,
    })
  })
})

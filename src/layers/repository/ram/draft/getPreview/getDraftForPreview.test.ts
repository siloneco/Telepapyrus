import { Draft } from '@/layers/entity/types'
import { getDraftForPreview } from './getDraftForPreview'
import { setDraftForPreview } from '../setPreview/setDraftForPreview'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  description: 'description',
  content: 'content',
  tags: [],
  public: true,
}

describe('getDraftForPreview', () => {
  it('gets draft data correctly', async () => {
    await setDraftForPreview(baseData)

    const result = await getDraftForPreview(baseData.id)
    expect(result).toMatchObject({
      success: true,
      data: baseData,
    })
  })

  it('return not exists when there is no data found', async () => {
    const id = 'tmp-test-draft-preview-not-exists'
    const result = await getDraftForPreview(id)
    expect(result).toMatchObject({
      success: false,
      error: {
        id: 'not-exists',
      },
    })
  })
})

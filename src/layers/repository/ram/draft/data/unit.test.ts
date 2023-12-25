import { Draft } from '@/layers/entity/types'
import { getData, setData } from '.'

const baseData: Draft = {
  id: 'id',
  title: 'title',
  content: 'content',
  tags: [],
  public: true,
}

describe('draft data cache for preview', () => {
  it('caches draft data correctly', () => {
    expect(setData(baseData.id, baseData)).toBe(true)
  })

  it('gets draft data correctly', () => {
    setData(baseData.id, baseData)
    expect(getData(baseData.id)).toMatchObject(baseData)
  })
})

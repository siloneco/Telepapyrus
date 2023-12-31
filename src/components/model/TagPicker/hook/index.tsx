import { useEffect, useState } from 'react'
import { fetchAllAvailableTags } from '../logic'

type ReturnProps = {
  sortedAllTags: string[]
  setSortedAllTags: (_tags: string[]) => void
}

export const useTagPicker = (): ReturnProps => {
  const [sortedAllTags, setSortedAllTags] = useState<string[]>([])

  useEffect(() => {
    fetchAllAvailableTags().then((tags) => {
      if (tags) {
        setSortedAllTags(tags)
      }
    })
  }, [])

  return {
    sortedAllTags,
    setSortedAllTags,
  }
}

import { KeyboardEvent, useState } from 'react'
import { createTag } from '../../logic'

type Props = {
  sortedAllTags: string[]
  setSortedAllTags: (_sortedAllTags: string[]) => void
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_selectedTags: string[]) => void
}

type ReturnProps = {
  newTagValue: string
  setNewTagValue: (_newTagValue: string) => void
  creatingTag: boolean
  handleKeyDownForCreatingTagInput: (
    _event: KeyboardEvent<HTMLInputElement>,
  ) => Promise<void>
}

const useTagListCommandItems = ({
  sortedAllTags,
  setSortedAllTags,
  sortedSelectedTags,
  setSortedSelectedTags,
}: Props): ReturnProps => {
  const [creatingTag, setCreatingTag] = useState(false)
  const [newTagValue, setNewTagValue] = useState('')

  const handleKeyDownForCreatingTagInput = async (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter') {
      return
    }

    setCreatingTag(true)

    try {
      const result = await createTag({
        tag: newTagValue,
        sortedSelectedTags,
        setSortedSelectedTags,
        sortedAllTags,
        setSortedAllTags,
      })

      if (result.success) {
        setNewTagValue('')
      }

      // TODO: handling result.requiresErrorIcon
    } finally {
      setCreatingTag(false)
    }
  }

  return {
    newTagValue,
    setNewTagValue,
    creatingTag,
    handleKeyDownForCreatingTagInput,
  }
}

export default useTagListCommandItems

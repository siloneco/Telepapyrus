type ToggleTagSelectingProps = {
  tag: string
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_selectedTags: string[]) => void
}

export const toggleTagSelecting = ({
  tag,
  sortedSelectedTags,
  setSortedSelectedTags,
}: ToggleTagSelectingProps) => {
  if (sortedSelectedTags.includes(tag)) {
    setSortedSelectedTags(sortedSelectedTags.filter((t) => t !== tag))
  } else {
    setSortedSelectedTags([...sortedSelectedTags, tag].sort())
  }
}

type CreateTagProps = {
  tag: string
  sortedSelectedTags: string[]
  setSortedSelectedTags: (_selectedTags: string[]) => void
  sortedAllTags: string[]
  setSortedAllTags: (_allTags: string[]) => void
}

type CreateTagResult = {
  success: boolean
  requiresErrorIcon: boolean
}

export const createTag = async ({
  tag,
  sortedSelectedTags,
  setSortedSelectedTags,
  sortedAllTags,
  setSortedAllTags,
}: CreateTagProps): Promise<CreateTagResult> => {
  if (tag.length === 0) {
    return { success: false, requiresErrorIcon: false }
  }
  if (sortedAllTags.includes(tag)) {
    toggleTagSelecting({ tag, sortedSelectedTags, setSortedSelectedTags })
    return { success: true, requiresErrorIcon: false }
  }

  const protocol = window.location.protocol
  const hostname = window.location.hostname

  const res = await fetch(`${protocol}//${hostname}/api/v1/tag/${tag}`, {
    method: 'POST',
  })

  if (res.status === 200) {
    const newAllTags = [...sortedAllTags, tag].sort()
    setSortedAllTags(newAllTags)

    const newSelectedTags = [...sortedSelectedTags, tag].sort()
    setSortedSelectedTags(newSelectedTags)

    return { success: true, requiresErrorIcon: false }
  }

  return { success: false, requiresErrorIcon: true }
}

export const fetchAllAvailableTags = async (): Promise<string[] | null> => {
  const protocol = window.location.protocol
  const hostname = window.location.hostname

  const res = await fetch(`${protocol}//${hostname}/api/v1/tag/list`)

  if (res.status === 200) {
    return await res.json()
  }

  return null
}

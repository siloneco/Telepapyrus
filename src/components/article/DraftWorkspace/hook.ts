import { useState } from 'react'
import { TabState, SwitchEventCallback } from './type'
import { TabContextProps, IUseDraftWorkspace } from './type'
import { INTERNAL_BACKEND_HOSTNAME } from '@/lib/constants/API'
import { Draft } from '@/components/types/Article'

const baseUrl: string =
  process.env.NEXT_PUBLIC_BASEURL || INTERNAL_BACKEND_HOSTNAME

async function cacheDraft(id: string, title: string, content: string) {
  const data: Draft = {
    id: id,
    title: title,
    content: content,
  }

  await fetch(`${baseUrl}/api/v1/draft/preview`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

async function saveDraft(id: string, title: string, content: string) {
  const data: Draft = {
    id: id,
    title: title,
    content: content,
  }

  await fetch(`${baseUrl}/api/v1/draft/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function useDraftWorkspaceHooks(id: string): IUseDraftWorkspace {
  const [activeTab, setActiveTag] = useState<TabState>('write')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingDraft, setLoadingDraft] = useState(false)

  const [onMount, setOnMount] = useState<SwitchEventCallback[]>([])

  async function switchTab(tab: TabState) {
    if (activeTab === tab) {
      return
    }

    if (activeTab === 'write') {
      await cacheDraft(id, title, content)
      saveDraft(id, title, content) // don't wait for this
    }

    await onMount.find((e) => e.key === tab)?.fn()

    setActiveTag(tab)
  }

  const registerOnMount = (key: TabState, fn: () => Promise<void>) => {
    if (onMount.find((e) => e.key === key)) {
      return
    }
    setOnMount((prev) => {
      return [...prev, { key: key, fn: fn }]
    })
  }

  const createArticle = async (title: string, tags: string[] | undefined) => {
    const data: Draft = {
      id: id,
      title: title,
      content: content,
      tags: tags,
    }

    await fetch(`${baseUrl}/api/v1/article/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  const tabContextProviderValue: TabContextProps = {
    active: activeTab,
    setActive: setActiveTag,
    content: content,
    setContent: setContent,
    registerOnMount: registerOnMount,
  }

  return {
    title,
    setTitle,
    content,
    setContent,
    activeTab,
    switchTab,
    modalOpen,
    setModalOpen,
    loadingDraft,
    setLoadingDraft,
    tabContextProviderValue,
    createArticle,
  }
}

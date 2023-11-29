import { useEffect, useRef, useState } from 'react'
import { TabState, SwitchEventCallback } from './type'
import { TabContextProps, IUseDraftWorkspace } from './type'
import { Draft } from '@/components/types/Article'

function getBaseUrl() {
  const protocol = window.location.protocol
  const host = window.location.host

  return `${protocol}//${host}`
}

async function cacheDraft(id: string, title: string, content: string) {
  const data: Draft = {
    id: id,
    title: title,
    content: content,
  }

  await fetch(`${getBaseUrl()}/api/v1/draft/preview`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

async function saveDraft(
  id: string,
  title: string,
  content: string,
): Promise<boolean> {
  const data: Draft = {
    id: id,
    title: title,
    content: content,
  }

  const res = await fetch(`${getBaseUrl()}/api/v1/draft/${data.id}`, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return res.status === 200
}

export function useDraftWorkspaceHooks(id: string): IUseDraftWorkspace {
  const [activeTab, setActiveTag] = useState<TabState>('write')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [loadingDraft, setLoadingDraft] = useState<boolean>(true)
  const [isSaved, setSaved] = useState(false)
  const [isSavingDraft, setSavingDraft] = useState(false)
  const [onMount, setOnMount] = useState<SwitchEventCallback[]>([])

  const activeTabRef = useRef<TabState>(activeTab)
  const executeSaveDraftRef = useRef<() => Promise<void>>()

  const executeSaveDraft = async () => {
    const success: boolean = await saveDraft(id, title, content)
    if (success) {
      setSaved(true)
    }
  }

  activeTabRef.current = activeTab
  executeSaveDraftRef.current = executeSaveDraft

  const switchTab = async (tab: TabState) => {
    if (activeTab === tab) {
      return
    }

    if (activeTab === 'write') {
      await cacheDraft(id, title, content)
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

  const createArticle = async (
    title: string,
    tags: string[] | undefined,
  ): Promise<boolean> => {
    const data: Draft = {
      id: id,
      title: title,
      content: content,
      tags: tags,
    }

    const res = await fetch(`${getBaseUrl()}/api/v1/article/${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    })

    return res.status === 200
  }

  const fetchDraft = async () => {
    setLoadingDraft(true)

    try {
      const protocol = window.location.protocol
      const hostname = window.location.hostname

      const res = await fetch(`${protocol}//${hostname}/api/v1/draft/${id}`, {
        next: { revalidate: 1 },
      })

      if (res.status !== 200) {
        return
      }

      const data = await res.json()

      setTitle(data.title)
      setContent(data.content)
    } finally {
      setLoadingDraft(false)
    }
  }

  const tabContextProviderValue: TabContextProps = {
    active: activeTab,
    setActive: setActiveTag,
    content: content,
    setContent: setContent,
    registerOnMount: registerOnMount,
    loadingDraft: loadingDraft,
  }

  useEffect(() => {
    setSaved(false)
  }, [setSaved, title, content])

  useEffect(() => {
    fetchDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const down = async (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()

        if (activeTabRef.current !== 'write') {
          return
        }

        setSavingDraft(true)
        if (executeSaveDraftRef.current !== undefined) {
          await executeSaveDraftRef.current()
        }
        setSavingDraft(false)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    isSaved,
    setSaved,
    isSavingDraft,
    setSavingDraft,
    executeSaveDraft,
    fetchDraft,
    tabContextProviderValue,
    createArticle,
  }
}

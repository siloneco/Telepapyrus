'use client'

import { createContext, useEffect } from 'react'
import { TabState } from './type'
import { IUseDraftWorkspace } from './type'
import { useDraftWorkspaceHooks } from './hook'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DraftSubmitDialog from '../submit-dialog/DraftSubmitDialog'

export const TabContext = createContext({
  active: 'write',
  content: '',
  setActive: (_tab: TabState) => {},
  setContent: (_content: string) => {},
  registerOnMount: (_key: TabState, _fn: () => Promise<void>) => {},
})

type Props = {
  id: string
  children: React.ReactNode
}

export default function DraftWorkspace({ id, children }: Props) {
  const {
    title,
    setTitle,
    content,
    setContent,
    activeTab,
    switchTab,
    loadingDraft,
    setLoadingDraft,
    tabContextProviderValue,
    createArticle,
  }: IUseDraftWorkspace = useDraftWorkspaceHooks(id)

  const minToRead = Math.ceil(content.length / 70) / 10

  useEffect(() => {
    if (loadingDraft) {
      return
    }

    setLoadingDraft(true)

    const fetchDraft = async () => {
      const protocol = window.location.protocol
      const hostname = window.location.hostname

      const res = await fetch(`${protocol}//${hostname}/api/v1/draft/${id}`)
      const data = await res.json()

      setTitle(data.title)
      setContent(data.content)
      setLoadingDraft(false)
    }

    fetchDraft()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <TabContext.Provider value={tabContextProviderValue}>
      <div className="mx-auto max-w-3xl mt-8">
        <Input
          className="mb-3 text-base"
          placeholder="記事のタイトルを入力"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
          }}
        />
        <div className="flex flex-row items-center mb-3">
          <Button
            variant="secondary"
            className="text-base mr-2"
            disabled={activeTab === 'write'}
            onClick={() => {
              switchTab('write')
            }}
          >
            Draft
          </Button>
          <Button
            variant="secondary"
            className="text-base mr-2"
            disabled={activeTab === 'preview'}
            onClick={() => {
              switchTab('preview')
            }}
          >
            Preview
          </Button>
          <p className="text-base text-gray-400">{minToRead} min to read</p>
          <DraftSubmitDialog
            title={title}
            setTitle={setTitle}
            createArticle={createArticle}
          />
        </div>
        {children}
      </div>
    </TabContext.Provider>
  )
}

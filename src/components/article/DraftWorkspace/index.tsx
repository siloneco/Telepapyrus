'use client'

import { createContext } from 'react'
import { TabState } from './type'
import { IUseDraftWorkspace } from './type'
import { useDraftWorkspaceHooks } from './hook'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import DraftSubmitDialog from '../submit-dialog/DraftSubmitDialog'

export const TabContext = createContext({
  active: 'write',
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
    activeTab,
    switchTab,
    tabContextProviderValue,
    createArticle,
  }: IUseDraftWorkspace = useDraftWorkspaceHooks(id)

  const minToRead = Math.ceil(content.length / 70) / 10

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

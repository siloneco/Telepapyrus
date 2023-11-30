'use client'

import { createContext } from 'react'
import { TabState } from './type'
import { IUseDraftWorkspace } from './type'
import { useDraftWorkspaceHooks } from './hook'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import PostDraftDialog from '../post-dialog/PostDraftDialog'
import SaveButton from '@/components/misc/SaveButton'

export const TabContext = createContext({
  active: 'write',
  content: '',
  setActive: (_tab: TabState) => {},
  setContent: (_content: string) => {},
  registerOnMount: (_key: TabState, _fn: () => Promise<void>) => {},
  loadingDraft: false,
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
    loadingDraft,
    isSaved,
    isSavingDraft,
    executeSaveDraft,
    tabContextProviderValue,
    createArticle,
  }: IUseDraftWorkspace = useDraftWorkspaceHooks(id)

  const minToRead = Math.ceil(content.length / 70) / 1

  return (
    <TabContext.Provider value={tabContextProviderValue}>
      <div className="mx-auto max-w-3xl mt-8">
        <Input
          className="mb-3 text-base"
          placeholder={loadingDraft ? 'Loading...' : '記事のタイトルを入力'}
          disabled={loadingDraft}
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
          <div className="ml-auto flex items-center">
            <SaveButton
              checked={isSaved}
              onClick={executeSaveDraft}
              loading={isSavingDraft}
              className="mr-4"
            />
            <PostDraftDialog
              id={id}
              title={title}
              setTitle={setTitle}
              createArticle={createArticle}
            />
          </div>
        </div>
        {children}
      </div>
    </TabContext.Provider>
  )
}

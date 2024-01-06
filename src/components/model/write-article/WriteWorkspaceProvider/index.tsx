'use client'

import { UseWriteWorkspaceProviderReturnProps } from './type'
import { WriteWorkspaceContext, useWriteWorkspaceProvider } from './hook'
import { Input } from '@/components/ui/input'
import SaveButton from '@/components/misc/SaveButton'
import { estimateMinToRead } from './logic'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ReactNode } from 'react'
import { WriteWorkspaceMode } from '../WriteWorkspace'
import PostDialog from '../post-dialog/PostDialog'

type Props = {
  mode: WriteWorkspaceMode
  id: string
  children: ReactNode
}

export default function WriteWorkspaceProvider({ mode, id, children }: Props) {
  const {
    title,
    setTitle,
    content,
    loadingWorkspace,
    contextValue,
    saveStatus,
    onSaveButtonPressed,
    onTabValueChange,
    postDraft,
  }: UseWriteWorkspaceProviderReturnProps = useWriteWorkspaceProvider({
    mode,
    id,
  })

  const minToRead = estimateMinToRead(content)

  return (
    <WriteWorkspaceContext.Provider value={contextValue}>
      <div>
        <Input
          className="w-full mb-3 text-base"
          placeholder={loadingWorkspace ? 'Loading...' : '記事のタイトルを入力'}
          disabled={loadingWorkspace}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Tabs
          defaultValue="write"
          className="w-full max-w-3xl"
          onValueChange={onTabValueChange}
        >
          <div className="flex flex-row items-center mb-3">
            <TabsList className="h-11">
              <TabsTrigger value="write" className="text-base">
                編集
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-base">
                プレビュー
              </TabsTrigger>
            </TabsList>
            <p className="text-base text-card-foreground/80 ml-2">
              {minToRead} min to read
            </p>
            <div className="ml-auto flex items-center">
              <SaveButton
                checked={saveStatus.isSaved}
                onClick={onSaveButtonPressed}
                loading={saveStatus.isSavingDraft}
                className="mr-4"
              />
              {/* TOOD: select correct postDraft function */}
              <PostDialog mode={mode} postDraft={postDraft} />
            </div>
          </div>
          {children}
        </Tabs>
      </div>
    </WriteWorkspaceContext.Provider>
  )
}

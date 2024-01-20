import { Draft } from '@/layers/entity/types'

export type ContextProps = {
  id: { value: string }
  content: { value: string; set: (_content: string) => void }
  title: { value: string; set: (_title: string) => void }
  initialValues: {
    description: string
    tags: string[]
    isPublic: boolean
  }
  loadingWorkspace: boolean
  isPreviewLoadingState: boolean
}

export type SaveStatusProps = {
  isSaved: boolean
  setSaved: (_saved: boolean) => void
  isSavingDraft: boolean
  setSavingDraft: (_saving: boolean) => void
}

export type UseWriteWorkspaceProviderReturnProps = {
  title: string
  setTitle: (_title: string) => void
  content: string
  loadingWorkspace: boolean
  contextValue: ContextProps
  saveStatus: SaveStatusProps
  onSaveButtonPressed: () => Promise<void>
  onTabValueChange: (_tab: string) => void
  postDraft: (_draft: Draft) => Promise<boolean>
  changeDraftId: (_newId: string) => Promise<boolean>
}

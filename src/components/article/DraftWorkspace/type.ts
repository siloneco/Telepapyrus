export type TabState = 'write' | 'preview'

export type SwitchEventCallback = {
  key: string
  fn: () => Promise<void>
}

export type TabContextProps = {
  active: TabState
  setActive: (_tab: TabState) => void
  content: string
  setContent: (_content: string) => void
  registerOnMount: (_key: TabState, _fn: () => Promise<void>) => void
  loadingDraft: boolean
}

export type IUseDraftWorkspace = {
  title: string
  setTitle: (_title: string) => void
  content: string
  setContent: (_content: string) => void
  activeTab: string
  switchTab: (_tab: TabState) => Promise<void>
  modalOpen: boolean
  setModalOpen: (_open: boolean) => void
  loadingDraft: boolean
  setLoadingDraft: (_loading: boolean) => void
  isSaved: boolean
  setSaved: (_saved: boolean) => void
  isSavingDraft: boolean
  setSavingDraft: (_saving: boolean) => void
  executeSaveDraft: () => Promise<void>
  fetchDraft: () => Promise<void>
  tabContextProviderValue: TabContextProps
  createArticle: (
    _title: string,
    _tags: string[] | undefined,
  ) => Promise<boolean>
}

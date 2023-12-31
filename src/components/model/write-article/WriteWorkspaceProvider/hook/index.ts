import {
  createContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from 'react'
import {
  UseWriteWorkspaceProviderReturnProps,
  ContextProps,
  SaveStatusProps,
} from '../type'
import { WriteWorkspaceMode } from '../../WriteWorkspace'
import { Draft } from '@/layers/entity/types'
import { loadData } from './dataLoader'
import { saveDraft, sendPreviewData } from '../logic'
import { useRouter } from 'next/navigation'
import { useWriteWorkspaceShortcuts } from './shortcuts'

export const WriteWorkspaceContext = createContext({
  id: { value: '' },
  content: { value: '', set: (_content: string) => {} },
  title: { value: '', set: (_title: string) => {} },
  initialValues: {
    tags: [''],
  },
  loadingWorkspace: true,
  isPreviewLoadingState: true,
})

type Props = {
  mode: WriteWorkspaceMode
  id: string
}

export function useWriteWorkspaceProvider({
  mode,
  id,
}: Props): UseWriteWorkspaceProviderReturnProps {
  const [title, setTitle] = useState<string>('')
  const [content, setContent] = useState<string>('')
  const [initialTags, setInitialTags] = useState<string[]>([])
  const [loadingWorkspace, setLoadingWorkspace] = useState<boolean>(true)
  const [isSaved, setSaved] = useState<boolean>(false)
  const [savingDraft, setSavingDraft] = useState<boolean>(false)
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false)
  const [currentTab, setCurrentTab] = useState<'write' | 'preview'>('write')
  const [isTransitioning, startTransition] = useTransition()
  const router = useRouter()

  const contextValue: ContextProps = {
    id: { value: id },
    content: { value: content, set: setContent },
    title: { value: title, set: setTitle },
    initialValues: {
      tags: initialTags,
    },
    loadingWorkspace: loadingWorkspace,
    isPreviewLoadingState: loadingPreview,
  }

  const saveStatus: SaveStatusProps = {
    isSaved: isSaved,
    setSaved: setSaved,
    isSavingDraft: savingDraft,
    setSavingDraft: setSavingDraft,
  }

  const onTabValueChange = (tab: string) => {
    if (tab === 'write') {
      setCurrentTab('write')
    } else if (tab === 'preview') {
      setCurrentTab('preview')
      setLoadingPreview(true)

      const data: Draft = {
        id: contextValue.id.value,
        title: contextValue.title.value,
        content: contextValue.content.value,
        tags: [],
        public: true,
      }

      sendPreviewData(data).then(() => {
        if (isTransitioning) {
          return
        }

        startTransition(() => {
          try {
            router.refresh()
          } finally {
            setLoadingPreview(false)
          }
        })
      })
    }
  }

  const onSaveButtonPressed = async () => {
    setSavingDraft(true)

    const draft: Draft = {
      id: id,
      title: title,
      content: content,
      tags: [],
      public: true,
    }

    const result = await saveDraft(draft)

    if (result) {
      setSaved(true)
    }

    setSavingDraft(false)
  }

  // Reset saved state when title or content changes
  useEffect(() => setSaved(false), [title, content])

  // Fetch data on first page load
  useEffect(() => {
    setLoadingWorkspace(true)

    loadData({ mode, id })
      .then((draft) => {
        if (draft === null) {
          return
        }

        setTitle(draft.title)
        setContent(draft.content)
        setInitialTags(draft.tags)
      })
      .finally(() => {
        setLoadingWorkspace(false)
      })
  }, [mode, id])

  const activeTabRef = useRef<'write' | 'preview'>(currentTab)
  const pressSaveButtonRef = useRef(onSaveButtonPressed)

  activeTabRef.current = currentTab
  pressSaveButtonRef.current = onSaveButtonPressed

  useWriteWorkspaceShortcuts({
    activeTabRef,
    pressSaveButtonRef,
  })

  return {
    title,
    setTitle,
    content,
    loadingWorkspace,
    contextValue,
    saveStatus,
    onSaveButtonPressed,
    onTabValueChange,
  }
}

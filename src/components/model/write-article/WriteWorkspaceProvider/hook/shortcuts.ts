import { MutableRefObject, useEffect } from 'react'

type Props = {
  activeTabRef: MutableRefObject<'write' | 'preview'>
  pressSaveButtonRef: MutableRefObject<() => Promise<void>>
}

export const useWriteWorkspaceShortcuts = ({
  activeTabRef,
  pressSaveButtonRef,
}: Props) => {
  useEffect(() => {
    const down = async (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()

        if (activeTabRef.current !== 'write') {
          return
        }

        pressSaveButtonRef.current()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [activeTabRef, pressSaveButtonRef])
}

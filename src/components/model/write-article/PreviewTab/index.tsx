'use client'

import { ReactNode, useContext } from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { WriteWorkspaceContext } from '../WriteWorkspaceProvider/hook'
import { ErrorBoundary } from 'react-error-boundary'
import { fallbackRender } from './fallback'

type Props = {
  children: ReactNode
}

export default function PreviewTab({ children }: Props) {
  const { isPreviewLoadingState } = useContext(WriteWorkspaceContext)

  if (isPreviewLoadingState) {
    return <TabsContent value="preview">Loading...</TabsContent>
  }

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>
      <TabsContent value="preview">{children}</TabsContent>
    </ErrorBoundary>
  )
}

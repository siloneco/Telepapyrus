'use client'

import { useContext } from 'react'
import { TabsContent } from '@/components/ui/tabs'
import { WriteWorkspaceContext } from '../WriteWorkspaceProvider/hook'
import { Textarea } from '@/components/ui/textarea'

export default function WriteTab() {
  const { content, loadingWorkspace } = useContext(WriteWorkspaceContext)

  return (
    <TabsContent value="write">
      <div>
        <Textarea
          placeholder={loadingWorkspace ? 'Loading...' : '# Title'}
          value={content.value}
          disabled={loadingWorkspace}
          onChange={(e) => content.set(e.target.value)}
          className="font-mono w-full h-[calc(100vh-250px)] min-h-[500px] resize-none outline-none dark:bg-muted"
        />
      </div>
    </TabsContent>
  )
}

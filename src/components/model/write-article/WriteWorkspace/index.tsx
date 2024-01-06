import PreviewLoader from '../PreviewLoader'
import PreviewTab from '../PreviewTab'
import WriteTab from '../WriteTab'
import WriteWorkspaceProvider from '../WriteWorkspaceProvider'

export type WriteWorkspaceMode = 'write-draft' | 'edit-article'

type Props = {
  mode: WriteWorkspaceMode
  id: string
}

export default function WriteWorkspace({ mode, id }: Props) {
  return (
    <div className="p-4 mx-auto max-w-3xl mt-8 rounded-3xl bg-card text-card-foreground">
      <WriteWorkspaceProvider mode={mode} id={id}>
        <WriteTab />
        <PreviewTab>
          <PreviewLoader id={id} />
        </PreviewTab>
      </WriteWorkspaceProvider>
    </div>
  )
}

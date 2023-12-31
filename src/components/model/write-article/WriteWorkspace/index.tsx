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
    <WriteWorkspaceProvider mode={mode} id={id}>
      <WriteTab />
      <PreviewTab>
        <PreviewLoader id={id} />
      </PreviewTab>
    </WriteWorkspaceProvider>
  )
}

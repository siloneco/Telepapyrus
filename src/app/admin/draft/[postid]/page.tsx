import DraftEditor from '@/components/article/DraftEditor'
import DraftLoader from '@/components/article/DraftLoader'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'

type Props = {
  params: {
    id: string
  }
}

export default function Page({ params }: Props) {
  const { id } = params
  return (
    <DraftWorkspace id={id}>
      <DraftEditor />
      <DraftPreview>
        <DraftLoader id={id} />
      </DraftPreview>
    </DraftWorkspace>
  )
}

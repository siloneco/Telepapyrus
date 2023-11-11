import DraftEditor from '@/components/article/DraftEditor'
import DraftLoader from '@/components/article/DraftLoader'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'

type Props = {
  params: {
    postid: string
  }
}

export default function Page({ params }: Props) {
  const { postid } = params
  return (
    <DraftWorkspace id={postid}>
      <DraftEditor />
      <DraftPreview>
        <DraftLoader postid={postid} />
      </DraftPreview>
    </DraftWorkspace>
  )
}

import DraftEditor from '@/components/article/DraftEditor'
import DraftLoader from '@/components/article/DraftLoader'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { redirect } from 'next/navigation'
import { isValidID } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'

type MetadataProps = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const id: string = params.id

  return {
    title: `${id} - Draft | Silolab Blog`,
  }
}

type Props = {
  params: {
    id: string
  }
}

export default function Page({ params }: Props) {
  const { id } = params

  if (!isValidID(id)) {
    redirect('/admin/draft/error/id-invalid')
  } else if (id.length > ARTICLE_ID_MAX_LENGTH) {
    redirect('/admin/draft/error/id-too-long')
  }

  return (
    <DraftWorkspace id={id}>
      <DraftEditor />
      <DraftPreview>
        <DraftLoader id={id} />
      </DraftPreview>
    </DraftWorkspace>
  )
}

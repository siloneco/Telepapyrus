import DraftEditor from '@/components/article/DraftEditor'
import DraftLoader from '@/components/article/DraftLoader'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { notFound } from 'next/navigation'
import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { redirect } from 'next/navigation'

type Props = {
  params: {
    id: string
  }
}

export default async function Page({ params }: Props) {
  const { id } = params

  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return notFound()
  }

  if (id.length > ARTICLE_ID_MAX_LENGTH) {
    redirect('/admin/draft/error/id-too-long')
  }

  return (
    <DraftWorkspace id={id}>
      <DraftEditor />
      <DraftPreview>
        <DraftLoader userEmail={session.user.email} id={id} />
      </DraftPreview>
    </DraftWorkspace>
  )
}

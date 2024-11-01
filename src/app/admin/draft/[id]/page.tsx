import { ARTICLE_ID_MAX_LENGTH } from '@/lib/constants/Constants'
import { redirect } from 'next/navigation'
import { isValidID } from '@/lib/utils'
import { Metadata, ResolvingMetadata } from 'next'
import WriteWorkspace from '@/components/model/write-article/WriteWorkspace'
import { getArticleUseCase } from '@/layers/use-case/article/ArticleUseCase'

type MetadataProps = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: MetadataProps,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const id: string = (await params).id

  return {
    title: `${id} - Draft | Silolab Blog`,
  }
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  if (!isValidID(id)) {
    redirect('/admin/draft/error/id-invalid')
  } else if (id.length > ARTICLE_ID_MAX_LENGTH) {
    redirect('/admin/draft/error/id-too-long')
  }

  const article = await getArticleUseCase().getArticle(id)

  if (article.isSuccess()) {
    redirect(`/admin/draft/error/id-duplicate?id=${id}`)
  }

  return <WriteWorkspace mode="write-draft" id={id} />
}

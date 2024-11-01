import { redirect } from 'next/navigation'
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
    title: `${id} - Edit | Silolab Blog`,
  }
}

type Props = {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: Props) {
  const { id } = await params

  const result = await getArticleUseCase().getArticle(id)
  if (result.isFailure()) {
    redirect('/admin/edit/error/not-found')
  }

  return <WriteWorkspace mode="edit-article" id={id} />
}

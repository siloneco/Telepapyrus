import ArticlePostTime from '../ArticlePostTime'
import { Separator } from '@/components/ui/separator'
import { getServerSession } from 'next-auth/next'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import ArticleEditButton from '@/components/misc/ArticleEditButton'
import { FC } from 'react'
import TagList from '@/components/model/TagList'

type Props = {
  id: string
  title: string
  date: string
  lastUpdated?: string
  tags: string[]
}

export default async function ArticleHeader({
  id,
  title,
  date,
  lastUpdated,
  tags,
}: Props) {
  const session = await getServerSession(authOptions)
  const isValidAdmin = session !== undefined && session !== null

  const fullWidthTitle = tags.length > 0

  const Title: FC = () => <h1 className="text-3xl font-bold">{title}</h1>

  return (
    <div className="mb-3">
      {fullWidthTitle && <Title />}
      <div className="flex flex-rows items-end">
        <div>
          {!fullWidthTitle && <Title />}
          <ArticlePostTime date={date} lastUpdated={lastUpdated} />
          <TagList tags={tags} className="mb-2" />
        </div>
        {isValidAdmin && <ArticleEditButton id={id} className="ml-auto mb-2" />}
      </div>
      <Separator />
    </div>
  )
}

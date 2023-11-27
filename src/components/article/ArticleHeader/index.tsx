import ArticleTag from '../ArticleTag'
import ArticlePostTime from '../ArticlePostTime'
import { Separator } from '@/components/ui/separator'
import PreviousPageNavigator from '@/components/misc/PreviousPageNavigator'
import { getServerSession } from 'next-auth/next'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import ArticleEditButton from '@/components/misc/ArticleEditButton'
import { FC } from 'react'

type Props = {
  id: string
  title: string
  date: string
  lastUpdated: string | null
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
      <PreviousPageNavigator />
      {fullWidthTitle && <Title />}
      <div className="flex flex-rows items-end">
        <div>
          {!fullWidthTitle && <Title />}
          <ArticlePostTime date={date} lastUpdated={lastUpdated} />
          {tags.map((tag) => (
            <ArticleTag key={tag} tag={tag} className="mr-2 mb-2" />
          ))}
        </div>
        {isValidAdmin && <ArticleEditButton id={id} className="ml-auto mb-2" />}
      </div>
      <Separator />
    </div>
  )
}

import ArticleTag from '../ArticleTag'
import ArticlePostTime from '../ArticlePostTime'
import { Separator } from '@/components/ui/separator'

type Props = {
  title: string
  date: string
  lastUpdated: string | null
  tags: string[]
}

export default function ArticleHeader({
  title,
  date,
  lastUpdated,
  tags,
}: Props) {
  return (
    <div className="mb-3">
      <h1 className="text-3xl font-bold">{title}</h1>
      <ArticlePostTime date={date} lastUpdated={lastUpdated} />
      {tags.map((tag) => (
        <ArticleTag key={tag} tag={tag} className="mr-2 mb-2" />
      ))}
      <Separator />
    </div>
  )
}

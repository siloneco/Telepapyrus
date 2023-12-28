import ArticleTag from '../ArticleTag'
import Link from 'next/link'
import ArticlePostTime from '../ArticlePostTime'
import { cn } from '@/lib/utils'

type Props = {
  id: string
  title: string
  date: string
  lastUpdated: string | null
  tags: string[]
}

export default function ArticleCard({
  id,
  title,
  date,
  lastUpdated,
  tags,
}: Props) {
  return (
    <div
      className={cn('w-full mb-2 py-3', {
        'pb-1': tags.length > 0,
      })}
    >
      <Link href={`/article/${id}`}>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
      </Link>
      <div>
        <ArticlePostTime date={date} lastUpdated={lastUpdated} />
        <div>
          {tags.map((tag) => (
            <ArticleTag key={tag} tag={tag} className="mr-2 mb-2" />
          ))}
        </div>
      </div>
    </div>
  )
}

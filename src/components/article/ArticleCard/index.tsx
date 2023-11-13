import ArticleTag from '../ArticleTag'
import Link from 'next/link'
import ArticlePostTime from '../ArticlePostTime'

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
    <div className="w-full mb-3 p-3 bg-black border border-gray-700 rounded-xl transition-shadow hover:shadow-[0_0_0.5rem_rgb(211,211,211)]">
      <Link href={`/post/${id}`}>
        <h1 className="text-2xl font-bold text-white">{title}</h1>
      </Link>
      <div>
        <ArticlePostTime date={date} lastUpdated={lastUpdated} />
        <div>
          {tags.map((tag) => (
            <ArticleTag key={tag} tag={tag} className="mr-2 mt-2" />
          ))}
        </div>
      </div>
    </div>
  )
}

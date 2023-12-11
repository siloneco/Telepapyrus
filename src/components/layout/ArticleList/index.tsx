import { ArticleOverview } from '@/components/types/Article'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'
import { FC, memo } from 'react'

type Props = {
  articles: Array<ArticleOverview>
  currentPage: number
  totalPages: number
  path?: string
}

export default async function ArticleList(data: Props) {
  const CachedArticleList: FC<Props> = memo(function generateArticleList({
    articles,
    currentPage,
    totalPages,
    path = '/',
  }: Props) {
    return (
      <main>
        <div className="max-w-3xl mx-5 mt-5 md:mx-auto">
          {articles.map((article: ArticleOverview, index: number) => (
            <ArticleCard
              key={index}
              id={article.id}
              title={article.title}
              date={article.date}
              lastUpdated={article.last_updated}
              tags={article.tags}
            />
          ))}
          <PageSelector
            path={path}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        </div>
      </main>
    )
  })

  return <CachedArticleList {...data} />
}

import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'
import { FC, memo } from 'react'
import { Separator } from '@/components/ui/separator'
import { PresentationArticleOverview } from '@/layers/use-case/article/ArticleUseCase'

type Props = {
  articles: PresentationArticleOverview[]
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
          {articles.map(
            (article: PresentationArticleOverview, index: number) => (
              <div key={article.id}>
                <ArticleCard
                  id={article.id}
                  title={article.title}
                  date={article.date}
                  lastUpdated={article.last_updated}
                  tags={article.tags}
                />
                {index !== articles.length - 1 && (
                  <Separator className="my-2" />
                )}
              </div>
            ),
          )}
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

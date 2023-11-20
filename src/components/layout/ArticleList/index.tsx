import { ArticleOverview } from '@/components/types/Article'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'

type Props = {
  articles: Array<ArticleOverview>
  currentPage: number
  totalPages: number
}

export default function ArticleList(data: Props) {
  const { articles, currentPage, totalPages } = data

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
          path={'/'}
          currentPage={currentPage}
          totalPages={totalPages}
        />
      </div>
    </main>
  )
}

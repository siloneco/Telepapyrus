import { ArticleOverview } from '@/components/types/Article'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'

type Props = {
  posts: Array<ArticleOverview>
  currentPage: number
  totalPages: number
}

export default function ArticleList(data: Props) {
  const { posts, currentPage, totalPages } = data

  return (
    <main>
      <div className="max-w-3xl mx-5 mt-5 md:mx-auto">
        {posts.map((post: ArticleOverview, index: number) => (
          <ArticleCard
            key={index}
            id={post.id}
            title={post.title}
            date={post.date}
            lastUpdated={post.last_updated}
            tags={post.tags}
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

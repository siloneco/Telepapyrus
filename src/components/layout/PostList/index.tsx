import { PostOverview } from '@/components/types/Post'
import ArticleCard from '@/components/article/ArticleCard'
import PageSelector from '@/components/page/PageSelector'

type Props = {
  posts: Array<PostOverview>
  currentPage: number
  totalPages: number
}

export default function PostList(data: Props) {
  const { posts, currentPage, totalPages } = data

  return (
    <main>
      <div className="max-w-3xl mx-5 mt-5 md:mx-auto">
        {posts.map((post: PostOverview, index: number) => (
          <ArticleCard
            key={index}
            id={post.id}
            title={post.title}
            date={post.formatted_date}
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

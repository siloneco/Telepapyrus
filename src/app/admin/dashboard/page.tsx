import { ArticleTable } from '@/components/admin/ArticleTable'
import { columns } from '@/components/admin/ArticleTable/columns'
import { NewArticleInput } from '@/components/admin/NewArticleInput'
import { ArticleOverview } from '@/components/types/Article'
import { getAllArticles } from '@/lib/database/FetchAllArticles'
import { getServerSession } from 'next-auth'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sha256 } from '@/lib/utils'

async function getArticleOverview(): Promise<ArticleOverview[]> {
  const session: any = await getServerSession(authOptions)
  if (session === undefined || session.user?.email === undefined) {
    return []
  }

  const userEmailHash: string = sha256(session.user.email)

  return await getAllArticles(userEmailHash)
}

export default async function Page() {
  const data: ArticleOverview[] = await getArticleOverview()

  return (
    <div className="max-w-5xl mx-auto mt-5 mb-10">
      <h1 className="text-4xl font-bold text-center">Dashboard (WIP)</h1>
      <div className="w-1/2 mx-auto mt-4">
        <NewArticleInput />
      </div>
      <div className="w-4/5 mx-auto">
        <h2 className="text-xl font-bold mt-8 mb-2">記事一覧</h2>
        <div className="w-full">
          <ArticleTable columns={columns} data={data} />
        </div>
      </div>
    </div>
  )
}

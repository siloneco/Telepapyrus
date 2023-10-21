import { getDraftData } from "@/lib/article/DraftArticleCache"
import ArticleRenderer from '@/components/article/ArticleRenderer'

export default async function ArticleContentProvider({ postid }: { postid: string }) {
    const content: string | undefined = await getDraftData(postid)

    if (content === undefined) {
        return (<p>undefined</p>)
    }

    return (
        <ArticleRenderer content={content} />
    )
}
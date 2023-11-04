import { getDraftData } from '@/lib/article/DraftArticleCache'
import ArticleRenderer from '@/components/article/ArticleRenderer'

type Props = {
    postid: string
}

export default async function DraftContentProvider({ postid }: Props) {
    const content: string | undefined = await getDraftData(postid)

    if (content === undefined) {
        return (<p>undefined</p>)
    }

    return (
        <ArticleRenderer content={content} />
    )
}
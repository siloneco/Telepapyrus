import { getDraftData } from '@/lib/article/DraftArticleCache'
import ArticleRenderer from '@/components/article/ArticleRenderer'
import { PostSubmitFormat } from '@/components/types/PostSubmitFormat'

type Props = {
    postid: string
}

export default async function DraftContentProvider({ postid }: Props) {
    const data: PostSubmitFormat | undefined = await getDraftData(postid)

    if (data === undefined) {
        return (<p>undefined</p>)
    }

    return (
        <ArticleRenderer content={data.content} />
    )
}
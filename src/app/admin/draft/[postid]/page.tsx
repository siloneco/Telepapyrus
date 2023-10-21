import DraftEditor from '@/components/article/DraftEditor'
import ArticleContentProvider from '@/components/article/ArticleContentProvider'

const baseUrl: string = process.env.BASEURL || 'http://localhost:3000'

export default function Page({ params }: { params: { postid: string } }) {
    const postid: string = params.postid
    return (
        <div>
            <DraftEditor id={postid} baseUrl={baseUrl}>
                <ArticleContentProvider postid={postid} />
            </DraftEditor>
        </div>
    )
}
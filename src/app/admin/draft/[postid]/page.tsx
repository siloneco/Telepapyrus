import DraftEditor from '@/components/article/DraftEditor'
import DraftContentProvider from '@/components/article/ArticleContentProvider'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'

const baseUrl: string = process.env.BASEURL || 'http://localhost:3000'

export default function Page({ params }: { params: { postid: string } }) {
    const postid: string = params.postid
    return (
        <DraftWorkspace id={postid} baseUrl={baseUrl}>
            <DraftEditor id={postid} baseUrl={baseUrl} />
            <DraftPreview id={postid} baseUrl={baseUrl}>
                <DraftContentProvider postid={postid} />
            </DraftPreview>
        </DraftWorkspace>
    )
}
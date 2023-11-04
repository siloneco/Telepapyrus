import DraftEditor from '@/components/article/DraftEditor'
import DraftContentProvider from '@/components/article/ArticleContentProvider'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'

const baseUrl: string = process.env.BASEURL || 'http://localhost:3000'

type Props = {
    params: {
        postid: string
    }
}

export default function Page({ params }: Props) {
    const postid: string = params.postid
    return (
        <DraftWorkspace id={postid} baseUrl={baseUrl}>
            <DraftEditor />
            <DraftPreview>
                <DraftContentProvider postid={postid} />
            </DraftPreview>
        </DraftWorkspace>
    )
}
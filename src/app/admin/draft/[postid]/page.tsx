import DraftEditor from '@/components/article/DraftEditor'
import DraftContentProvider from '@/components/article/ArticleContentProvider'
import DraftWorkspace from '@/components/article/DraftWorkspace'
import DraftPreview from '@/components/article/DraftPreview'

type Props = {
    params: {
        postid: string
    }
}

export default function Page({ params }: Props) {
    const { postid } = params
    return (
        <DraftWorkspace id={postid}>
            <DraftEditor />
            <DraftPreview>
                <DraftContentProvider postid={postid} />
            </DraftPreview>
        </DraftWorkspace>
    )
}
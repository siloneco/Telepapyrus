const hljs = require('highlight.js')
const markedHighlight = require('marked-highlight')

import { Marked } from "marked"
import ArticleHeader from '@/components/article/ArticleHeader'
import styles from "./style/style.module.css"

import 'highlight.js/styles/github.css'
import "./style/HighlightjsFont.css"

const marked = new Marked(
    markedHighlight.markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code: string, lang: string) {
            lang = lang.split(':')[0]
            const language = hljs.getLanguage(lang) ? lang : 'plaintext'
            return hljs.highlight(code, { language }).value
        }
    })
)

async function getPost(id: string) {
    const res = await fetch(`http://localhost:3000/api/post/${id}`, { next: { revalidate: 60 } })
    return res.json()
}

export default async function Page({ params }: { params: { postid: string } }) {
    const data = await getPost(params.postid)
    const html: string = (marked.parse(data.content, { async: false, mangle: false, headerIds: false }) || "") as string

    return (
        <div className={styles.article}>
            <ArticleHeader title={data.title} date={data.formatted_date} tags={data.tags} />
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    )
}
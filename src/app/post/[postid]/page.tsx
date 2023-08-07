const hljs = require('highlight.js');
const markedHighlight = require('marked-highlight');

import { Marked } from "marked";
import ArticleHeader from '@/components/article/ArticleHeader';
import styles from "./style/style.module.css";

import 'highlight.js/styles/github.css';
import "./style/HighlightjsFont.css"

const marked = new Marked(
    markedHighlight.markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code: any, lang: any) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        }
    })
);

const renderer = {
    code(code: any, language: any) {
        const highlighted = hljs.highlight(code, { language }).value;
        return `<pre><code class="hljs language-${language}">${highlighted}</code></pre>`;
    }
}

async function getPost(id: string) {
    const res = await fetch(`http://localhost:3000/api/post/${id}`, { next: { revalidate: 60 } })
    return res.json()
}

export default async function Page({ params }: { params: { postid: string } }) {
    const data = await getPost(params.postid)
    const html: string | Promise<string | undefined> = marked.parse(data.content, { async: false, mangle: false, headerIds: false }) || ""

    return (
        <div className={styles.article}>
            <ArticleHeader title={data.title} date={data.date} tags={data.tags} />
            <div dangerouslySetInnerHTML={{ __html: html }}></div>
        </div>
    )
}
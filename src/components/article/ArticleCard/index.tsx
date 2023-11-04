import ArticleTag from '../ArticleTag'
import styles from './style.module.css'
import articleStyle from '@/components/style/ArticleInformation.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'
import Link from 'next/link'
import { FaRegClock } from 'react-icons/fa'

type Props = {
    id: string,
    title: string,
    date: string,
    lastUpdated: string | null,
    tags: string[]
}

export default function ArticleCard({ id, title, date, lastUpdated, tags }: Props) {
    const dateTime = date.replace(/\//g, '-')
    const lastUpdatedDateTime = (lastUpdated !== undefined && lastUpdated !== null) ? lastUpdated?.replace(/\//g, '-') : ''

    return (
        <div className={styles.card}>
            <Link href={`/post/${id}`} className={linkStyle.linkWithoutStyle}>
                <h2 className={articleStyle.title}>{title}</h2>
            </Link>
            <div>
                <div className={articleStyle.dateContainer}>
                    <p className={articleStyle.date}>
                        <FaRegClock className={articleStyle.dateIcon} />
                        <time dateTime={dateTime}>{date}</time>
                    </p>
                    {lastUpdated && <p className={articleStyle.date}>(最終更新: <time dateTime={lastUpdatedDateTime}>{lastUpdated}</time>)</p>}
                </div>
                <div className={articleStyle.tags}>
                    {tags.map((tag) => <ArticleTag key={tag} tag={tag} />)}
                </div>
            </div>
        </div>
    )
}
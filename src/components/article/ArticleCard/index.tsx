import ArticleTag from '../ArticleTag'
import styles from './style.module.css'
import articleStyle from '@/components/style/ArticleInformation.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'
import Link from 'next/link'
import { FaRegClock } from 'react-icons/fa'

export default function ArticleCard({ id, title, date, lastUpdated, tags }: { id: string, title: string, date: string, lastUpdated: string | null, tags: string[] }) {
    return (
        <div className={styles.card}>
            <Link href={'/post/' + id} className={linkStyle.linkWithoutStyle}>
                <h2 className={articleStyle.title}>{title}</h2>
            </Link>
            <div>
                <div className={articleStyle.dateContainer}>
                    <p className={articleStyle.date}>
                        <FaRegClock className={articleStyle.dateIcon} />{date}
                    </p>
                    {lastUpdated && <p className={articleStyle.date}>(最終更新: {lastUpdated})</p>}
                </div>
                <div className={articleStyle.tags}>
                    {tags.map((tag, index) => <ArticleTag key={index} tag={tag} />)}
                </div>
            </div>
        </div>
    )
}
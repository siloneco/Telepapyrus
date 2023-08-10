import ArticleTag from '../ArticleTag'
import styles from './style.module.css'
import Link from 'next/link'
import { FaRegClock } from 'react-icons/fa'

export default function ArticleCard({ id, title, date, lastUpdated, tags }: { id: string, title: string, date: string, lastUpdated: string | null, tags: string[] }) {
    return (
        <div className={styles.card}>
            <Link href={'/post/' + id} className={styles.linkWithoutStyle}>
                <h2 className={styles.title}>{title}</h2>
            </Link>
            <div>
                <div className={styles.dateContainer}>
                    <p className={styles.date} style={{ marginRight: '0.5rem' }}>
                        <FaRegClock style={{ paddingRight: '2px' }} />{date}
                    </p>
                    {lastUpdated && <p className={styles.date}>(最終更新: {lastUpdated})</p>}
                </div>
                <div className={styles.tags}>
                    {tags.map((tag, index) => <ArticleTag key={index} tag={tag} />)}
                </div>
            </div>
        </div>
    )
}
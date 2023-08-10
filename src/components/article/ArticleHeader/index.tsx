import ArticleTag from '../ArticleTag'
import styles from './style.module.css'
import { FaRegClock } from 'react-icons/fa'

export default function ArticleHeader({ title, date, lastUpdated, tags }: { title: string, date: string, lastUpdated: string | null, tags: string[] }) {
    return (
        <div>
            <h1 style={{ marginBottom: '0px' }}>{title}</h1>
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
            <hr />
        </div>
    )
}
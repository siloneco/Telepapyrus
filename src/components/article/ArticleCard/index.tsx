import ArticleTag from "../ArticleTag"
import styles from "./style.module.css"
import Link from 'next/link'

export default function ArticleCard({ id, title, date, tags }: { id: string, title: string, date: string, tags: string[] }) {
    return (
        <div className={styles.card}>
            <Link href={"/post/" + id} className={styles.linkWithoutStyle}>
                <h2 className={styles.title}>{title}</h2>
            </Link>
            <div>
                <p className={styles.date}>{date}</p>
                <div className={styles.tags}>
                    {tags.map((tag, index) => <ArticleTag key={index} tag={tag} />)}
                </div>
            </div>
        </div>
    )
}
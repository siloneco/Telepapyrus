import Link from 'next/link'
import styles from './style.module.css'

export default function ArticleTag({ tag }: { tag: string }) {
    return (
        <Link className={styles.tag} href={'/tag/' + tag}>{tag}</Link>
    )
}
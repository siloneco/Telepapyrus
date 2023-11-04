import Link from 'next/link'
import styles from './style.module.css'

type Props = {
    tag: string
}

export default function ArticleTag({ tag }: Props) {
    return (
        <Link className={styles.tag} href={'/tag/' + tag}>{tag}</Link>
    )
}
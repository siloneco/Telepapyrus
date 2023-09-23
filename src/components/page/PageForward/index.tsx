import Link from 'next/link'
import styles from '@/components/style/PagingButton.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

export default function PageForward({ page }: { page: number }) {
    return (
        <Link
            key={page}
            href={`/${page}`}
            className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
            prefetch={false}
        >
            <div className={styles.button}>次のページ &gt;</div>
        </Link>
    )
}
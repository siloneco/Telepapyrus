import Link from 'next/link'
import styles from '@/components/style/PagingButton.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

export default function PageBack({ page, bright }: { page: number, bright: boolean }) {
    return (
        <Link
            key={page}
            href={`/${page}`}
            className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
            prefetch={false}
        >
            {bright && <div className={styles.button}>&lt; 前のページ</div>}
            {!bright && <div className={styles.buttonDark}>&lt; 前のページ</div>}
        </Link>
    )
}
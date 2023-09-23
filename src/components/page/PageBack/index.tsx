import Link from 'next/link'
import styles from '@/components/style/PagingButton.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

export default function PageBack({ path, page, bright }: { path: string, page: number, bright: boolean }) {
    return (
        <Link
            key={page}
            href={path + page}
            className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
            prefetch={false}
        >
            {bright && <div className={styles.button}>&lt; 前のページ</div>}
            {!bright && <div className={styles.buttonDark}>&lt; 前のページ</div>}
        </Link>
    )
}
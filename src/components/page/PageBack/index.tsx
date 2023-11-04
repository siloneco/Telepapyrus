import Link from 'next/link'
import styles from '@/components/style/PagingButton.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

type Props = {
    path: string,
    page: number,
    bright: boolean
}

export default function PageBack({ path, page, bright }: Props) {
    return (
        <Link
            key={page}
            href={`${path}${page}`}
            className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
            prefetch={false}
        >
            {bright && <div className={styles.button}>&lt; 前のページ</div>}
            {!bright && <div className={styles.buttonDark}>&lt; 前のページ</div>}
        </Link>
    )
}
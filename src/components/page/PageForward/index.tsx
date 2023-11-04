import Link from 'next/link'
import styles from '@/components/style/PagingButton.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

type Props = {
    path: string,
    page: number
}

export default function PageForward({ path, page }: Props) {
    return (
        <Link
            key={page}
            href={`${path}${page}`}
            className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
            prefetch={false}
        >
            <div className={styles.button}>次のページ &gt;</div>
        </Link>
    )
}
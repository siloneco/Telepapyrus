import Link from 'next/link'
import styles from './style.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'

export default function PageSelector({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    const pageNumbers = [1, 2, 3, currentPage - 1, currentPage, currentPage + 1, totalPages - 2, totalPages - 1, totalPages]
    const elements = []

    let lastAddedPageNum = 0
    for (let i = 0; i < pageNumbers.length; i++) {
        const page = pageNumbers[i]

        if (page <= lastAddedPageNum) {
            continue
        }

        if (page - lastAddedPageNum > 1) {
            elements.push(<div key={`${page}-dots`}>･･･</div>)
        }

        if (page == currentPage) {
            elements.push(
                <span key={page} className={`${linkStyle.linkWithoutStyle} ${styles.pageButton} ${styles.pageButtonCurrent}`}>
                    {page}
                </span>
            )
        } else {
            elements.push(
                <Link
                    key={page}
                    href={`/${page}`}
                    className={`${linkStyle.linkWithoutStyle} ${styles.pageButton}`}
                    prefetch={false}
                >
                    {page}
                </Link>
            )
        }
        lastAddedPageNum = page
    }

    return (
        <div className={styles.pageSelector}>
            {elements}
        </div>
    )
}
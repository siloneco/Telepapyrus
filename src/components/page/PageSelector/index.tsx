import styles from './style.module.css'
import PageForward from '../PageForward'
import PageBack from '../PageBack'

export default function PageSelector({ currentPage, totalPages }: { currentPage: number, totalPages: number }) {
    return (
        <div className={styles.pageSelector}>
            {currentPage > 1 && <PageBack page={currentPage - 1} bright={currentPage == totalPages} />}
            {currentPage != totalPages && <PageForward page={currentPage + 1} />}
        </div>
    )
}
import styles from './style.module.css'
import PageForward from '../PageForward'
import PageBack from '../PageBack'

export default function PageSelector({ currentPage, totalPages, path }: { currentPage: number, totalPages: number, path: string }) {
    return (
        <div className={styles.pageSelector}>
            {currentPage > 1 && <PageBack path={path} page={currentPage - 1} bright={currentPage == totalPages} />}
            {currentPage != totalPages && <PageForward path={path} page={currentPage + 1} />}
        </div>
    )
}
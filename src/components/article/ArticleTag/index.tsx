import Link from 'next/link'
import styles from "./style.module.css";

export default function ArticleTag({ tag }: { tag: string }) {
    return (
        <Link className={styles.tag} href={"/posts?tag=" + tag}>{tag}</Link>
    )
}
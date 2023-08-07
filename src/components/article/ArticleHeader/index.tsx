import ArticleTag from "../ArticleTag";
import styles from "./style.module.css";

export default function ArticleHeader({ title, date, tags }: { title: string, date: string, tags: string[] }) {
    return (
        <div>
            <h1 style={{ marginBottom: "0px" }}>{title}</h1>
            <div>
                <p className={styles.date}>{date}</p>
                <div className={styles.tags}>
                    {tags.map((tag, index) => <ArticleTag key={index} tag={tag} />)}
                </div>
            </div>
            <hr />
        </div>
    )
}
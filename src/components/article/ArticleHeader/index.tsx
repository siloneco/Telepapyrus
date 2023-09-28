import ArticleTag from '../ArticleTag'
import articleStyle from '@/components/style/ArticleInformation.module.css'
import { FaRegClock } from 'react-icons/fa'

export default function ArticleHeader({ title, date, lastUpdated, tags }: { title: string, date: string, lastUpdated: string | null, tags: string[] }) {
    return (
        <div>
            <h1 className={articleStyle.title}>{title}</h1>
            <div>
                <div className={articleStyle.dateContainer}>
                    <p className={articleStyle.date} >
                        <FaRegClock className={articleStyle.dateIcon} />{date}
                    </p>
                    {lastUpdated && <p className={articleStyle.date}>(最終更新: {lastUpdated})</p>}
                </div>
                <div className={articleStyle.tags}>
                    {tags.map((tag, index) => <ArticleTag key={index} tag={tag} />)}
                </div>
            </div>
            <hr color='#636363' />
        </div>
    )
}
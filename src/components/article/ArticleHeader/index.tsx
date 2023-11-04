import ArticleTag from '../ArticleTag'
import articleStyle from '@/components/style/ArticleInformation.module.css'
import { FaRegClock } from 'react-icons/fa'

type Props = {
    title: string,
    date: string,
    lastUpdated: string | null,
    tags: string[]
}

export default function ArticleHeader({ title, date, lastUpdated, tags }: Props) {
    const dateTime = date.replace(/\//g, '-')
    const lastUpdatedDateTime = (lastUpdated !== undefined && lastUpdated !== null) ? lastUpdated?.replace(/\//g, '-') : ''

    return (
        <div>
            <h1 className={articleStyle.title}>{title}</h1>
            <div>
                <div className={articleStyle.dateContainer}>
                    <p className={articleStyle.date} >
                        <FaRegClock className={articleStyle.dateIcon} />
                        <time dateTime={dateTime}>{date}</time>
                    </p>
                    {lastUpdated && <p className={articleStyle.date}>(最終更新: <time dateTime={lastUpdatedDateTime}>{lastUpdated}</time>)</p>}
                </div>
                <div className={articleStyle.tags}>
                    {tags.map((tag) => <ArticleTag key={tag} tag={tag} />)}
                </div>
            </div>
            <hr color='#636363' />
        </div>
    )
}
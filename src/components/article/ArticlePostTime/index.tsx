import { FaRegClock } from 'react-icons/fa'

type Props = {
  date: string
  lastUpdated?: string
}

export default function ArticlePostTime({ date, lastUpdated }: Props) {
  const dateTime = date.replace(/\//g, '-')
  const lastUpdatedDateTime =
    lastUpdated !== undefined && lastUpdated !== null
      ? lastUpdated?.replace(/\//g, '-')
      : ''

  return (
    <div className="my-1 flex flex-row items-center text-sm text-secondary-foreground/80">
      <p className="flex flex-row items-center">
        <FaRegClock className="mr-1" />
        <time dateTime={dateTime}>{date}</time>
      </p>
      {lastUpdated && (
        <p className="ml-2">
          (最終更新: <time dateTime={lastUpdatedDateTime}>{lastUpdated}</time>)
        </p>
      )}
    </div>
  )
}

import ArticleTag from '@/components/article/ArticleTag'
import { FC } from 'react'

type DeployProps = {
  tags: string[]
  noLink?: boolean
}

const Deploy: FC<DeployProps> = ({ tags, noLink = false }) => (
  <>
    {tags.map((tag) => (
      <ArticleTag key={tag} tag={tag} className="mr-2 my-1" noLink={noLink} />
    ))}
  </>
)

type Props = {
  tags: string[]
  noLink?: boolean
  noWrapper?: boolean
  className?: string
}

const TagList: FC<Props> = ({
  tags,
  noLink = false,
  noWrapper = false,
  className,
}) => {
  if (noWrapper) {
    return <Deploy tags={tags} noLink={noLink} />
  }

  return (
    <div className={className}>
      <Deploy tags={tags} noLink={noLink} />
    </div>
  )
}

export default TagList

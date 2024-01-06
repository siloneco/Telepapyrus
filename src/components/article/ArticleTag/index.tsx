import Link from 'next/link'
import { badgeVariants } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

type Props = {
  tag: string
  noLink?: boolean
  className?: string
}

export default function ArticleTag({ tag, noLink = false, className }: Props) {
  const applyClassName: string = cn(
    badgeVariants({ variant: 'default' }),
    'text-xs',
    'h-6',
    'whitespace-nowrap',
    className,
  )

  if (!noLink) {
    return (
      <Link key={tag} href={`/tag/${tag}`} className={applyClassName}>
        {tag}
      </Link>
    )
  } else {
    return (
      <span key={tag} className={applyClassName}>
        {tag}
      </span>
    )
  }
}

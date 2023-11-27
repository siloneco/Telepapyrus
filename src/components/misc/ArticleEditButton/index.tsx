import { Button } from '@/components/ui/button'
import { FileEdit } from 'lucide-react'

type Props = {
  id: string
  className?: string
}

export default function ArticleEditButton({ className }: Props) {
  // TODO: Implement edit page and link it
  return (
    <Button variant="ghost" className={className}>
      <FileEdit />
    </Button>
  )
}

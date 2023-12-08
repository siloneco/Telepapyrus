import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { FileEdit } from 'lucide-react'

type Props = {
  id: string
  className?: string
}

export default function ArticleEditButton({ className }: Props) {
  // TODO: Implement edit page and link it
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className={className}>
          <FileEdit />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit">
        <p>編集ボタン(未実装)</p>
      </PopoverContent>
    </Popover>
  )
}

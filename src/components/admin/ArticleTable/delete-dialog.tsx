import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { PresentationArticleOverview } from '@/layers/use-case/article/ArticleUseCase'
import { FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  article: PresentationArticleOverview
  executeDelete: (_id: string) => void
  children: React.ReactNode
}

export function DeleteDialogWrapper({
  article,
  executeDelete,
  children,
}: Props) {
  const [deleting, setDeleting] = useState(false)

  return (
    <AlertDialog>
      {children}
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除しますか？</AlertDialogTitle>
          <AlertDialogDescription className="text-card-foreground">
            <div className="flex flex-row items-center">
              <FileText size={24} className="text-card-foreground/60 mr-2" />
              <p className="text-lg font-bold">{`${article.id} - ${article.title}`}</p>
            </div>
          </AlertDialogDescription>
          <AlertDialogDescription>
            この記事を削除しますか？この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>キャンセル</AlertDialogCancel>
          <Button
            variant={'destructive'}
            disabled={deleting}
            onClick={() => {
              setDeleting(true)
              executeDelete(article.id)
            }}
          >
            {deleting && <Loader2 size={20} className="mr-2 animate-spin" />}
            削除
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function DeleteDialogTrigger() {
  return (
    <AlertDialogTrigger className="w-full text-left">削除</AlertDialogTrigger>
  )
}

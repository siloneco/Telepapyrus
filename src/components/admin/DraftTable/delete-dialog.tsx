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
import { DraftOverview } from '@/layers/entity/types'
import { FileText, Loader2 } from 'lucide-react'
import { useState } from 'react'

type Props = {
  draft: DraftOverview
  executeDelete: (_id: string) => void
  children: React.ReactNode
}

export function DeleteDialogWrapper({ draft, executeDelete, children }: Props) {
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
              <p className="text-lg font-bold">{`${draft.id} - ${draft.title}`}</p>
            </div>
          </AlertDialogDescription>
          <AlertDialogDescription>
            この下書きを削除しますか？この操作は取り消せません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleting}>キャンセル</AlertDialogCancel>
          <Button
            variant={'destructive'}
            disabled={deleting}
            onClick={() => {
              setDeleting(true)
              executeDelete(draft.id)
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

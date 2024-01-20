'use client'

import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { isValidID } from '@/lib/utils'
import { useRouter } from 'next/navigation'

type Props = {
  currentId: string
  saveDraft: () => Promise<void>
  changeDraftId: (_newId: string) => Promise<boolean>
}

export default function ChangeIdDialog({
  currentId,
  saveDraft,
  changeDraftId,
}: Props) {
  const [newId, setNewId] = useState<string>(currentId)
  const router = useRouter()

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={'ghost'} className="h-8 ml-2 py-1 px-2">
          IDを変更
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>IDを変更する - {currentId}</AlertDialogTitle>
          <AlertDialogDescription>
            <div className="mt-2">
              <Label className="text-card-foreground">新しいID</Label>
              <Input
                className="mt-1 text-card-foreground"
                value={newId}
                onChange={(e) => setNewId(e.target.value)}
              />
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>キャンセル</AlertDialogCancel>
          <Button
            variant={'destructive'}
            disabled={currentId === newId || !isValidID(newId)}
            onClick={async () => {
              await saveDraft()
              await changeDraftId(newId)
              router.push(`/admin/draft/${newId}`)
            }}
          >
            変更
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

'use client'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import TitleInput from '../form/TitleInput'
import TagSelector from '../form/TagSelector'
import VisibilitySelector from '../form/VisibilitySelector'
import ConfirmationCheckbox from '../form/ConfirmationCheckbox'
import { Loader2 } from 'lucide-react'
import { usePostDialog } from './hook'
import { Draft } from '@/layers/entity/types'
import { WriteWorkspaceMode } from '../../WriteWorkspace'

type Props = {
  mode: WriteWorkspaceMode
  postDraft: (_draft: Draft) => Promise<boolean>
}

export default function PostDialog({ mode, postDraft }: Props) {
  const { form, isPosting, onModalOpenChange, onSubmit } = usePostDialog({
    postDraft,
  })

  const submitVerb = mode === 'write-draft' ? '投稿' : '更新'

  return (
    <Dialog onOpenChange={onModalOpenChange}>
      <DialogTrigger asChild>
        <Button variant="default" className="ml-auto mr-0 text-base">
          {submitVerb}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{submitVerb}フォーム</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 max-w-[calc(512px-48px)]"
          >
            {/* >>> form items */}
            <TitleInput form={form} />
            <TagSelector form={form} />
            <VisibilitySelector form={form} />
            <ConfirmationCheckbox form={form} />
            {/* >>> form items */}
            <div className="flex justify-end">
              <DialogClose asChild>
                <Button
                  variant="secondary"
                  className="mr-2 text-base"
                  disabled={isPosting}
                >
                  キャンセル
                </Button>
              </DialogClose>
              <Button type="submit" className="text-base" disabled={isPosting}>
                {isPosting && (
                  <Loader2 size={20} className="mr-2 animate-spin" />
                )}
                <p>{submitVerb}</p>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

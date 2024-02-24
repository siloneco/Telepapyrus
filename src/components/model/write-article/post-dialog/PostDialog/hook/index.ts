import { Draft, PublishableDraft } from '@/layers/entity/types'
import { zodResolver } from '@hookform/resolvers/zod'
import { useContext, useState } from 'react'
import { UseFormReturn, useForm } from 'react-hook-form'
import * as z from 'zod'
import { WriteWorkspaceContext } from '../../../WriteWorkspaceProvider/hook'
import { useRouter } from 'next/navigation'

const formSchema = z.object({
  title: z
    .string({ errorMap: () => ({ message: 'タイトルは空にできません' }) })
    .min(1, {
      message: 'タイトルは空にできません',
    }),
  description: z
    .string({ errorMap: () => ({ message: '説明文は空にできません' }) })
    .min(1, {
      message: '説明文は空にできません',
    }),
  tags: z.string().array().optional(),
  visibility: z
    .enum(['public', 'private'], {
      required_error: '公開範囲を指定してください',
    })
    .default('private'),
  confirm: z.literal<boolean>(true),
})

type Props = {
  postDraft: (_draft: Draft) => Promise<boolean>
}

type ReturnProps = {
  form: UseFormReturn<
    {
      title: string
      description: string
      tags?: string[] | undefined
      visibility: 'public' | 'private'
      confirm: boolean
    },
    any
  >
  onSubmit: () => Promise<void>
  onModalOpenChange: (_open: boolean) => void
  isPosting: boolean
}

export const usePostDialog = ({ postDraft }: Props): ReturnProps => {
  const { id, title, content } = useContext(WriteWorkspaceContext)
  const [isPosting, setIsPosting] = useState(false)
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = async () => {
    setIsPosting(true)

    const data: PublishableDraft = {
      id: id.value,
      title: form.getValues().title,
      description: form.getValues().description,
      content: content.value,
      tags: form.getValues().tags || [],
      isPublic: form.getValues().visibility === 'public',
    }

    const success: boolean = await postDraft(data)

    if (success) {
      router.push(`/article/${id.value}`)
    } else {
      setIsPosting(false)
      // error handling for user
    }
  }

  const onModalOpenChange = (open: boolean) => {
    if (open) {
      form.setValue('title', title.value)
    } else {
      title.set(form.getValues('title'))
    }
  }

  return {
    form,
    onSubmit,
    onModalOpenChange,
    isPosting,
  }
}

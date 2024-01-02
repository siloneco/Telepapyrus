'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { useContext } from 'react'
import { UseFormReturn } from 'react-hook-form'
import { WriteWorkspaceContext } from '../../../WriteWorkspaceProvider/hook'

type Props = {
  form: UseFormReturn<any, undefined>
}

export default function DescriptionInput({ form }: Props) {
  const { initialValues } = useContext(WriteWorkspaceContext)

  return (
    <FormField
      control={form.control}
      name="description"
      render={({ field }) => {
        if (
          field.value === undefined &&
          initialValues.description !== undefined
        ) {
          form.setValue('description', initialValues.description)
          field.value = initialValues.description
        }

        return (
          <FormItem>
            <FormLabel>説明文</FormLabel>
            <FormControl>
              <Textarea
                placeholder="記事の説明を入力"
                value={field.value}
                onChange={field.onChange}
                className="h-20 resize-none"
              />
            </FormControl>
            <FormDescription>
              説明文は記事の概要を示す際に使用されます
            </FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

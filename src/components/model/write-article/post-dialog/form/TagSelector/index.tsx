'use client'

import { UseFormReturn } from 'react-hook-form'
import {
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import TagPicker from '@/components/model/TagPicker'
import TagList from '@/components/model/TagList'

type Props = {
  form: UseFormReturn<any, undefined>
}

export default function TagSelector({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => {
        if (field.value === undefined) {
          form.setValue('tags', [])
        }

        return (
          <FormItem className="flex flex-col">
            <FormLabel>タグ</FormLabel>
            <div className="flex flex-wrap">
              <TagPicker
                tags={field.value || []}
                setTags={(tags) => form.setValue('tags', tags)}
                className="my-1 mr-2"
              />
              <TagList tags={field.value || []} noWrapper noLink />
            </div>
            <FormDescription>
              タグは記事の検索や分類に利用されます
            </FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

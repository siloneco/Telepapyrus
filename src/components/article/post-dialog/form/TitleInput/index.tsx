'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<any, undefined>
}

export default function TitleInput({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="title"
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>タイトル</FormLabel>
            <FormControl>
              <Input
                {...field}
                placeholder="記事のタイトルを入力"
                onChange={field.onChange}
              />
            </FormControl>
            <FormDescription>
              タイトルは記事の先頭に表示されます
            </FormDescription>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

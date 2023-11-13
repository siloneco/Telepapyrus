'use client'

import { Checkbox } from '@/components/ui/checkbox'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { UseFormReturn } from 'react-hook-form'

type Props = {
  form: UseFormReturn<any, undefined>
}

export default function ConfirmationCheckbox({ form }: Props) {
  return (
    <FormField
      control={form.control}
      name="confirm"
      render={({ field }) => {
        return (
          <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
            <FormControl>
              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="space-y-1 leading-none">
              <FormLabel>
                私は記事の内容を見返しました。この記事を公開しても問題ありません。
              </FormLabel>
            </div>
          </FormItem>
        )
      }}
    />
  )
}

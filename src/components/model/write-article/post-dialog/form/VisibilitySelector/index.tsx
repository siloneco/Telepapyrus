'use client'

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { UseFormReturn } from 'react-hook-form'
import { WriteWorkspaceContext } from '../../../WriteWorkspaceProvider/hook'
import { useContext } from 'react'

type Props = {
  form: UseFormReturn<any, undefined>
}

export default function VisibilitySelector({ form }: Props) {
  const { initialValues } = useContext(WriteWorkspaceContext)

  return (
    <FormField
      control={form.control}
      name="visibility"
      render={({ field }) => {
        if (field.value === undefined && initialValues.isPublic !== undefined) {
          const initVisibility = initialValues.isPublic ? 'public' : 'unlisted'
          console.log(initVisibility)
          form.setValue('visibility', initVisibility)
          field.value = initVisibility
        }

        return (
          <FormItem className="space-y-3">
            <FormLabel>公開範囲</FormLabel>
            <FormControl>
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="flex flex-col space-y-2"
              >
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="public" />
                  </FormControl>
                  <FormLabel className="font-normal">公開</FormLabel>
                  <FormDescription>
                    記事は一般公開され誰でも見ることができます
                  </FormDescription>
                </FormItem>
                <FormItem className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value="unlisted" />
                  </FormControl>
                  <FormLabel className="font-normal">限定公開</FormLabel>
                  <FormDescription>
                    記事はリンクを知っている人のみ閲覧できます
                  </FormDescription>
                </FormItem>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

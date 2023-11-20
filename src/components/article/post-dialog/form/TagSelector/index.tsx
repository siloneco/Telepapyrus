'use client'

import { Check, Loader2, PlusIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import ArticleTag from '@/components/article/ArticleTag'
import { ScrollArea } from '@/components/ui/scroll-area'
import { KeyboardEvent, useState } from 'react'

type Props = {
  form: UseFormReturn<any, undefined>
  tags: string[]
  addTag: (_tag: string) => Promise<boolean>
}

export default function TagSelector({ form, tags, addTag }: Props) {
  const [creatingTag, setCreatingTag] = useState(false)
  const [createTagInputValue, setCreateTagInputValue] = useState('')

  const onEnterInCreatingTagInput = async (
    e: KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key !== 'Enter') {
      return
    }

    const newTag = e.currentTarget.value
    if (!newTag || newTag.length == 0) {
      return
    }

    setCreatingTag(true)
    await addTag(newTag)
    setCreatingTag(false)

    setCreateTagInputValue('')
  }

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
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className="w-6 h-6 mr-2 mt-2 "
                    >
                      <PlusIcon className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="タグを検索" />
                    <ScrollArea className="h-60">
                      <CommandEmpty>タグが見つかりません</CommandEmpty>
                      <CommandGroup>
                        {tags.map((tag: string) => (
                          <CommandItem
                            value={tag}
                            key={tag}
                            onSelect={() => {
                              let selectedTags = field.value
                              if (!selectedTags.includes(tag)) {
                                selectedTags = [...selectedTags, tag]
                              } else {
                                selectedTags = selectedTags.filter(
                                  (t: string) => t !== tag,
                                )
                              }

                              selectedTags.sort()
                              form.setValue('tags', selectedTags)
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                field.value !== undefined &&
                                  field.value.includes(tag)
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            <span className="truncate">{tag}</span>
                          </CommandItem>
                        ))}
                        <CommandItem>
                          {!creatingTag && (
                            <PlusIcon className="mr-2 h-4 w-4 opacity-60" />
                          )}
                          {creatingTag && (
                            <Loader2 className="mr-2 h-4 w-4 opacity-60 animate-spin" />
                          )}
                          <input
                            placeholder="新しいタグを作成"
                            className="bg-transparent outline-none"
                            value={createTagInputValue}
                            onChange={(e) =>
                              setCreateTagInputValue(e.target.value)
                            }
                            disabled={creatingTag}
                            onKeyDown={onEnterInCreatingTagInput}
                          />
                        </CommandItem>
                      </CommandGroup>
                    </ScrollArea>
                  </Command>
                </PopoverContent>
              </Popover>
              {field.value != undefined &&
                field.value.map((tag: string) => (
                  <ArticleTag
                    key={tag}
                    tag={tag}
                    noLink
                    className="mr-2 mt-2"
                  />
                ))}
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

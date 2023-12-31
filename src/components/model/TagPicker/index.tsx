'use client'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusIcon } from 'lucide-react'
import { FC } from 'react'
import TagListCommandItems from './component/TagListCommandItems'
import { useTagPicker } from './hook'
import ArticleTag from '@/components/article/ArticleTag'

type Props = {
  tags: string[]
  setTags: (_tags: string[]) => void
}

const TagPicker: FC<Props> = ({ tags, setTags }) => {
  const { sortedAllTags, setSortedAllTags } = useTagPicker()

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-6 h-6 mr-2 mt-2 "
          >
            <PlusIcon className="h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="タグを検索" />
            <ScrollArea className="h-60">
              <CommandEmpty>タグが見つかりません</CommandEmpty>
              <CommandGroup>
                <TagListCommandItems
                  sortedSelectedTags={tags}
                  setSortedSelectedTags={setTags}
                  sortedAllTags={sortedAllTags}
                  setSortedAllTags={setSortedAllTags}
                />
              </CommandGroup>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      {tags != undefined &&
        tags.map((tag: string) => (
          <ArticleTag key={tag} tag={tag} noLink className="mr-2 mt-2" />
        ))}
    </>
  )
}

export default TagPicker

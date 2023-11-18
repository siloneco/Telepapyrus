'use client'

import { useContext } from 'react'
import { TabContext } from '../DraftWorkspace'
import { cn } from '@/lib/utils'
import { Textarea } from '@/components/ui/textarea'

export default function DraftEditor() {
  const { active, content, setContent } = useContext(TabContext)

  return (
    <div
      className={cn({
        ['block']: active === 'write',
        ['hidden']: active !== 'write',
      })}
    >
      <Textarea
        placeholder="# Title"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="font-mono w-full h-[calc(100vh-250px)] min-h-[500px] resize-none outline-none bg-gray-800 "
      />
    </div>
  )
}

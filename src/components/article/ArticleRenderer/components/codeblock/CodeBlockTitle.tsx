'use client'

import { useContext } from 'react'
import { CodeContext } from './CodeBlockDiv'
import CopyButton from '@/components/misc/CopyButton'

type Props = {
  'data-rehype-pretty-code-title': string
  'data-language': string
  'data-theme': string
  children: string
}

export default function CodeBlockTitle(props: Props) {
  const { code } = useContext(CodeContext)

  return (
    <div {...props}>
      <p>{props.children}</p>
      <CopyButton value={code} className="ml-auto my-auto" />
    </div>
  )
}

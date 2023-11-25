'use client'

import { createContext, useState } from 'react'

export const CodeContext = createContext({
  code: '',
  setCode: (_code: string) => {},
})

export default function CodeBlockDiv(props: any) {
  const [code, setCode] = useState('')

  return (
    <CodeContext.Provider value={{ code: code, setCode: setCode }}>
      <div {...props} />
    </CodeContext.Provider>
  )
}

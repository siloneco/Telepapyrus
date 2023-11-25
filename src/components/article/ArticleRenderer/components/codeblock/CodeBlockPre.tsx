'use client'

import { useContext } from 'react'
import { CodeContext } from './CodeBlockDiv'

function isIterable(obj: any) {
  // checks for null and undefined
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

export default function CodeBlockPre(props: any) {
  const { setCode } = useContext(CodeContext)

  let code = ''
  for (const line of props.children.props.children) {
    if (line.props === undefined) {
      continue
    }

    const lineChildren = line.props.children

    if (!isIterable(lineChildren)) {
      // Check line is not empty, and then add content to the code
      if (lineChildren !== undefined) {
        code += lineChildren.props.children
      }

      // Add a new line
      code += '\n'
      continue
    }

    // Add each token to the code
    for (const token of lineChildren) {
      code += token.props.children
    }

    // Add a new line
    code += '\n'
  }

  setCode(code)

  return <pre {...props} />
}

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

function getRawCode(lines: Array<any>) {
  let code = ''
  for (const line of lines) {
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

  return code
}

export default function CodeBlockPre(props: any) {
  const { setCode } = useContext(CodeContext)

  let lines = props.children.props.children
  if (!isIterable(lines)) {
    lines = [lines]
  }

  setCode(getRawCode(lines))

  return <pre {...props} />
}

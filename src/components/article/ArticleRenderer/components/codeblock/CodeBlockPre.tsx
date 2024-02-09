'use client'

import { useContext } from 'react'
import { CodeContext } from './CodeBlockFigure'

function isIterable(obj: any) {
  if (obj == null) {
    return false
  }
  return typeof obj[Symbol.iterator] === 'function'
}

function getRawCode(lines: any[]) {
  let code = ''
  for (const line of lines) {
    if (line.props === undefined) {
      continue
    }

    const rawSpans = line.props.children

    if (rawSpans === undefined) {
      // may be a blank line
      code += '\n'
      continue
    }

    const spans = isIterable(rawSpans) ? rawSpans : [rawSpans]

    // Add each token to the code
    for (const token of spans) {
      if (token.props.children) {
        code += token.props.children
      }
    }

    // Add a new line
    code += '\n'
  }

  if (code.length > 0) {
    // Remove the last new line
    code = code.substring(0, code.length - 1)
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

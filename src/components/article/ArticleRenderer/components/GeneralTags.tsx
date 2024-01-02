import { FC } from 'react'
import CodeBlockFigure from './codeblock/CodeBlockFigure'
import CodeBlockTitle from './codeblock/CodeBlockTitle'
import { cn } from '@/lib/utils'
import Image from 'next/image'

export const Figure: FC<any> = (props) => {
  if (props['data-rehype-pretty-code-figure'] !== undefined) {
    return <CodeBlockFigure {...props} />
  }
  return <figure {...props} />
}

export const FigCaption: FC<any> = (props) => {
  if (props['data-rehype-pretty-code-title'] !== undefined) {
    return <CodeBlockTitle {...props} />
  }
  return <figcaption {...props} />
}

export const A: FC<any> = (props) => {
  if (
    props['data-footnote-ref'] == true ||
    props['data-footnote-backref'] == true
  ) {
    return <a className="text-blue-400" {...props} />
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer nofollow"
      className="text-blue-400"
      {...props}
    />
  )
}

export const Ul: FC<any> = (props) => {
  {
    if (props.className === 'contains-task-list') {
      return <ul {...props} className={cn(props.className, 'list-none pl-0')} />
    }
    return <ul {...props} />
  }
}

export const CompiledInput: FC<any> = (props) => {
  if (props.type === 'checkbox') {
    return (
      <input
        {...props}
        disabled={false}
        className={cn(props.className, 'accent-primary pointer-events-none')}
      />
    )
  }
  return <input {...props} />
}

const FallbackableImage: FC<any> = (props) => {
  if (props.width === undefined || props.height === undefined) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={props.src} alt={props.alt} className="max-h-[400px] my-0" />
    )
  }

  return (
    <Image
      src={props.src}
      alt={props.alt}
      height={props.height}
      width={props.width}
      className="my-0"
    />
  )
}

export const OptimizedImage: FC<any> = (props) => {
  const src = props.src

  const aspectRatio = props.width / props.height

  const height =
    props.height !== undefined ? Math.min(400, props.height) : undefined
  const width =
    height !== undefined ? Math.ceil(height * aspectRatio) : undefined

  return (
    <a href={src} className="block w-fit mx-auto my-2">
      <FallbackableImage
        src={src}
        alt={props.alt}
        height={height}
        width={width}
        className="my-0"
      />
    </a>
  )
}

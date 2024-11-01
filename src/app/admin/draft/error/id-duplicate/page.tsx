import { Metadata } from 'next'
import ArticleIdConflictError from './display'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'IDは既に使われています | Silolab Blog',
}

export default function Page() {
  return (
    <Suspense>
      <ArticleIdConflictError />
    </Suspense>
  )
}

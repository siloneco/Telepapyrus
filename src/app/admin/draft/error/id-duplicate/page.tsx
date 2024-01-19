import { Metadata } from 'next'
import ArticleIdConflictError from './display'

export const metadata: Metadata = {
  title: 'IDは既に使われています | Silolab Blog',
}

export default function Page() {
  return <ArticleIdConflictError />
}

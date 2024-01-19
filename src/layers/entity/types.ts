export type Article = {
  id: string
  title: string
  description: string
  content: string
  tags: string[]
  isPublic: boolean
  date: Date
  last_updated?: Date
}

export type ArticleOverview = Omit<Article, 'content'>

export type Draft = Pick<Article, 'id' | 'title' | 'content'>

export type DraftOverview = Pick<Draft, 'id' | 'title'>

export type PublishableDraft = Omit<Article, 'date' | 'last_updated'>

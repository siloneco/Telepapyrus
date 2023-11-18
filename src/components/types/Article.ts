export type Article = {
  id: string
  title: string
  content: string
  date: string
  last_updated: string | null
  tags: Array<string>
}

export type ArticleOverview = {
  id: string
  title: string
  date: string
  last_updated: string | null
  tags: Array<string>
}

export type Draft = {
  id: string
  title: string
  content: string
  tags?: Array<string>
}

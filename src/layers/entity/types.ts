export type Article = {
  id: string
  title: string
  content: string
  tags: string[]
  public: boolean
  date: Date
  last_updated: Date | null
}

export type Draft = {
  id: string
  title: string
  content: string
  tags: string[]
  public: boolean
}

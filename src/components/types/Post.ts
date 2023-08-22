export type Post = {
    id: string,
    title: string,
    content: string,
    formatted_date: string,
    last_updated: string | null,
    tags: Array<string>
}

export type PostOverview = {
    id: string,
    title: string,
    formatted_date: string,
    last_updated: string | null,
    tags: Array<string>
}
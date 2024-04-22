export const insertArticleSQL = `
INSERT INTO articles (id, title, description, content, date) VALUES (:id, :title, :description, :content, now(3));
`

export const insertTagsSQL = `
INSERT INTO tags (id, tag) VALUES :items;
`

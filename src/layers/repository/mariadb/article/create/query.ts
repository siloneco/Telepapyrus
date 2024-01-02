export const insertArticleSQL = `
INSERT INTO articles (id, title, description, content, date) VALUES (?, ?, ?, ?, now(3));
`

export const insertTagsSQL = `
INSERT INTO tags (id, tag) VALUES ?;
`

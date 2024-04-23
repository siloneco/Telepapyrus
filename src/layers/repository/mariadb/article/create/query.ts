export const insertArticleSQL = `
INSERT INTO articles (id, title, description, content, date, public) VALUES (:id, :title, :description, :content, now(3), :isPublic);
`

export const insertTagsSQL = `
INSERT INTO tags (id, tag) VALUES :items;
`

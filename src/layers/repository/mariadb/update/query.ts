export const updateArticleSQL = () => `
UPDATE articles SET title = ?, content = ? WHERE id = ?;
`

export const deleteTagsSQL = () => `
DELETE FROM tags WHERE id = ?;
`

export const insertTagsSQL = () => `
INSERT INTO tags (id, tag) VALUES ?;
`

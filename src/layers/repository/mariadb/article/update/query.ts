export const updateArticleSQL = () => `
UPDATE articles SET title = ?, description = ?, content = ?, last_updated = now(3) WHERE id = ?;
`

export const deleteTagsSQL = () => `
DELETE FROM tags WHERE id = ?;
`

export const insertTagsSQL = () => `
INSERT INTO tags (id, tag) VALUES ?;
`

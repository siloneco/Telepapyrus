export const updateArticleSQL = () => `
UPDATE articles SET title = :title, description = :description, content = :content, last_updated = now(3) WHERE id = :id;
`

export const deleteTagsSQL = () => `
DELETE FROM tags WHERE id = :id;
`

export const insertTagsSQL = () => `
INSERT INTO tags (id, tag) VALUES :items;
`

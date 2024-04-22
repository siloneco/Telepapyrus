export const deleteArticleQuery = () => `
DELETE FROM articles WHERE id = :id;
`

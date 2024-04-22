export const getDraftQuery = () => `
SELECT id, title, content FROM drafts WHERE id = :id;
`

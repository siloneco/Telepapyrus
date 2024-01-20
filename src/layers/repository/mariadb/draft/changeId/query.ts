export const getQuery = () => `
UPDATE drafts SET id = ? WHERE id = ?;
`

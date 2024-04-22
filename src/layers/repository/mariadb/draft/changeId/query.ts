export const getQuery = () => `
UPDATE drafts SET id = :newId WHERE id = :oldId;
`

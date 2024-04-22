export const getDeleteDraftSQL = () => `
DELETE FROM drafts WHERE id = :id;
`

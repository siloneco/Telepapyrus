export const getDeleteTagSQL = () => `
DELETE FROM allowed_tags WHERE tag = :tag;
`

export const listAllQuery = `
SELECT
  id,
  title
FROM
  drafts;
`

export const listAllWithPageQuery = `
SELECT
  id,
  title
FROM
  drafts
ORDER BY id ASC LIMIT 10 OFFSET :offset;
`

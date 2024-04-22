export const countAllQuery = `
SELECT
  COUNT(*) AS count
FROM articles;
`

export const countWithTagsQuery = `
SELECT
  COUNT(*) AS count
FROM (
  SELECT
	  id
	FROM tags
    WHERE tag IN (:tags)
    GROUP BY id
    HAVING COUNT(DISTINCT tag) = :amountOfTags
  ) AS a;
`

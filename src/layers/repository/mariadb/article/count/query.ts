export const countAllQuery = `
SELECT
  COUNT(*) AS count
FROM articles
WHERE
  public = true OR
  (:includePrivateArticles = true AND public = false);
`

export const countWithTagsQuery = `
SELECT
  COUNT(*) AS count
FROM articles
WHERE
  id IN (
    SELECT
	    id
    FROM tags
    WHERE tag IN (:tags)
    GROUP BY id
    HAVING COUNT(DISTINCT tag) = :amountOfTags
  ) AND (
    public = true OR
    (:includePrivateArticles = true AND public = false)
  );
`

export const listAllQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.date,
  articles.last_updated,
  articles.public,
  tags.tags
FROM
  articles LEFT JOIN
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tags
  	  FROM tags
      GROUP BY id
	)
  AS tags ON tags.id = articles.id
WHERE
  articles.public = true OR
  (:includePrivateArticles = true AND articles.public = false);
`

export const listAllWithPageQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.date,
  articles.last_updated,
  articles.public,
  tags.tags
FROM
  (
    SELECT
      *
	  FROM articles
    WHERE
      date <= (
        SELECT date FROM pages WHERE page = :page
      ) AND
      public = true
    ORDER BY date DESC
    LIMIT 10
  ) as articles LEFT JOIN
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tags
  	  FROM tags
      WHERE id IN
        (
          SELECT
            id
          FROM articles
          WHERE
            date <= (
              SELECT date FROM pages WHERE page = :page
            ) AND
            public = true
        )
      GROUP BY id
	) AS tags ON tags.id = articles.id
ORDER BY date DESC;
`

export const listAllWithTagsAndPageQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  date,
  last_updated,
  articles.public,
  tags.tags
FROM
  articles INNER JOIN 
    (
      SELECT
        id,
        GROUP_CONCAT(DISTINCT tag SEPARATOR ',') as tags
      FROM tags
      WHERE id IN
      (
        SELECT
	      id
        FROM tags
        WHERE tag IN (:tags)
        GROUP BY id
        HAVING COUNT(DISTINCT tag) = :amountOfTags
      )
      GROUP BY id
    ) as tags ON tags.id = articles.id
WHERE articles.public = true
ORDER BY date DESC LIMIT 10 OFFSET :offset;
`

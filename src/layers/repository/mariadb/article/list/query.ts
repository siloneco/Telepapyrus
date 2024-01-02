export const listAllQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.content,
  articles.date,
  articles.last_updated,
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
  AS tags ON tags.id = articles.id;
`

export const listAllWithPageQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.content,
  articles.date,
  articles.last_updated,
  tags.tags
FROM
  (
    SELECT
      *
	  FROM articles
    WHERE date <= (
        SELECT date FROM pages WHERE page = ?
      )
    ORDER BY date DESC
    LIMIT 10
  )  as articles LEFT JOIN
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
          WHERE date <=
            (
              SELECT date FROM pages WHERE page = ?
            )
        )
      GROUP BY id
	)
  AS tags ON tags.id = articles.id;
`

export const listAllWithTagsAndPageQuery = `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.content,
  date,
  last_updated,
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
        WHERE tag IN (?)
        GROUP BY id
        HAVING COUNT(DISTINCT tag) = ?
      )
      GROUP BY id
    ) as tags ON tags.id = articles.id
ORDER BY date DESC LIMIT 10 OFFSET ?;
`

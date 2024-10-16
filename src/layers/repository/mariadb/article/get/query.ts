export const getArticleQuery = () => `
SELECT
  articles.id,
  articles.title,
  articles.description,
  articles.content,
  articles.date,
  articles.public,
  articles.last_updated,
  tag.tag
FROM
  articles,
  (
    SELECT IFNULL(
      (
        SELECT
          GROUP_CONCAT(DISTINCT tag SEPARATOR ',') AS tag
  	    FROM tags
        WHERE id = :id
        GROUP BY id
      ),
      NULL
    ) AS tag
  ) AS tag
WHERE articles.id = :id;
`

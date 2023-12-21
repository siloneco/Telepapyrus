export const getArticleQuery = () => `
SELECT
  articles.id,
  articles.title,
  articles.content,
  articles.date,
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
        WHERE id = ?
        GROUP BY id
      ),
      NULL
    ) AS tag
  ) AS tag
WHERE articles.id = ?;
`

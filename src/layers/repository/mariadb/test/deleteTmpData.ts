import withConnection from '../connection/withConnection'

const deleteTagsQuery = 'DELETE FROM tags WHERE id LIKE "tmp-test-%"'
const deleteArticlesQuery = 'DELETE FROM articles WHERE id LIKE "tmp-test-%"'
const deleteAllowedTagsQuery =
  'DELETE FROM allowed_tags WHERE tag LIKE "tmp-test-%"'
const deleteDraftsQuery = 'DELETE FROM drafts WHERE id LIKE "tmp-test-%"'

export const deleteTmpData = async (): Promise<boolean> => {
  return await withConnection(async (connection) => {
    try {
      await connection.beginTransaction()
      await connection.query(deleteTagsQuery)
      await connection.query(deleteArticlesQuery)
      await connection.query(deleteAllowedTagsQuery)
      await connection.query(deleteDraftsQuery)
      await connection.commit()

      return true
    } catch (error: any) {
      await connection.rollback()

      console.error(error)
      return false
    }
  })
}

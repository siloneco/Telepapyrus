import getConnectionPool from '../connection/getConnectionPool'
import { deleteTmpData } from './deleteTmpData'

const teardown = async () => {
  await deleteTmpData()

  const pool = await getConnectionPool()
  await pool.end()
}

export default teardown

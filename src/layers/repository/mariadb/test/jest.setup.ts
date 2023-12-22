import getConnectionPool from '../connection/getConnectionPool'
import { deleteTmpData } from './deleteTmpData'

const setup = async () => {
  try {
    await deleteTmpData()

    const connection = await getConnectionPool()
    await connection.end()
  } catch (err) {
    console.error(err)
  }
}

export default setup

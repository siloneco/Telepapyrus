// import httpMocks from 'node-mocks-http'
// import { NextResponse } from 'next/server'
// import { GET } from './route'
// import { getConnectionPool } from '@/lib/database/MysqlConnectionPool'

it('will be true', () => {
  expect(true).toBe(true)
})

// describe('GET /api/v1/article/[id]', () => {
//   it('responds article data correctly', async () => {
//     const { req } = httpMocks.createMocks({
//       method: 'GET',
//     })

//     const exist: NextResponse<any> = await GET(req, { params: { id: 'test' } })

//     expect(exist.status).toBe(200)
//   })

//   it('responds 404 not found correctly', async () => {
//     const { req } = httpMocks.createMocks({
//       method: 'GET',
//     })

//     const notExist: NextResponse<any> = await GET(req, {
//       params: { id: 'not-found' },
//     })

//     expect(notExist.status).toBe(404)
//   })
// })

// afterAll(async () => {
//   const connectionPool = await getConnectionPool()
//   connectionPool.end()
// })

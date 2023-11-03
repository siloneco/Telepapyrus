import { withAuth } from 'next-auth/middleware'

const ownerEmail: string | null = process.env.OWNER_EMAIL || null

export default withAuth({
    callbacks: {
        authorized: ({ token }) => {
            if (ownerEmail == null) {
                return false
            }
            return token?.email === ownerEmail
        },
    }
})

export const config = { matcher: ['/(admin/.*)', '/(api/admin/.*)'] }
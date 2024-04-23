import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const clientId: string = process.env.GITHUB_ID || ''
const clientSecret: string = process.env.GITHUB_SECRET || ''

const ownerEmail: string | null = process.env.OWNER_EMAIL || null

type GitHubEmail = {
  email: string
  verified: boolean
  primary: boolean
  visibility: 'public' | 'unlisted'
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'github') return true

      const emailRes = await fetch('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${account.access_token}`,
        },
        next: {
          revalidate: 60,
        },
      })

      const emails = await emailRes.json()
      const primaryEmail = emails.find((e: GitHubEmail) => e.primary).email

      user.email = primaryEmail

      if (ownerEmail == null || user.email !== ownerEmail) {
        return false
      }

      return true
    },
  },
})

export { handler as GET, handler as POST }

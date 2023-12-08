import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'

const clientId: string = process.env.GITHUB_ID || ''
const clientSecret: string = process.env.GITHUB_SECRET || ''

type GitHubEmail = {
  email: string
  verified: boolean
  primary: boolean
  visibility: 'public' | 'private'
}

const handler = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GithubProvider({
      clientId: clientId ?? '',
      clientSecret: clientSecret ?? '',
    }),
  ],
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
      return true
    },
  },
})

export { handler as GET, handler as POST }

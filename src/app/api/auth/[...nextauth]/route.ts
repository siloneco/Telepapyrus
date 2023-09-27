import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

const clientId: string = process.env.GITHUB_ID || ""
const clientSecret: string = process.env.GITHUB_SECRET || ""

const handler = NextAuth({
    secret: process.env.NEXTAUTH_SECRET,
    providers: [
        GithubProvider({
            clientId: clientId ?? '',
            clientSecret: clientSecret ?? '',
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            if (account?.provider !== 'github') return true;

            const emailRes = await fetch('https://api.github.com/user/emails', {
                headers: {
                    Authorization: `token ${account.access_token}`,
                },
            });

            const emails = await emailRes.json();
            const primaryEmail = emails.find((e: {
                email: string,
                verified: boolean,
                primary: boolean,
                visibility: 'public' | 'private'
            }) => e.primary).email;

            user.email = primaryEmail;
            return true;
        }
    },
})

export { handler as GET, handler as POST }
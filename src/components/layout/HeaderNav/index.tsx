import Link from 'next/link'
import { FaGithub, FaHome } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiMisskey } from 'react-icons/si'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DiscordButton from '../DiscordButton'
import { getServerSession } from 'next-auth/next'
import { GET as authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FolderLock } from 'lucide-react'
import SignOutNavButton from '@/components/misc/SignOutNavButton'
import ToggleThemeButton from '@/components/misc/ToggleThemeButton'

const iconCss: string = 'text-2xl pr-5 text-foreground pr-0'

const githubUsername: string | undefined = process.env.PROFILE_GITHUB_USERNAME
const xUsername: string | undefined = process.env.PROFILE_X_USERNAME
const discordUsername: string | undefined = process.env.PROFILE_DISCORD_USERNAME
const misskeyUrl: string | undefined = process.env.PROFILE_MISSKEY_URL

export default async function HeaderNav() {
  const session = await getServerSession(authOptions)
  const isValidAdmin = session !== undefined && session !== null

  const darkenCss: string =
    'text-card-foreground/20 dark:text-card-foreground/30'

  return (
    <nav className="sticky top-0 shadow-sm z-10">
      <div className="h-14 w-full bg-card flex flex-row justify-center items-center">
        <div className="h-full w-full max-w-4xl flex flex-row content-between items-center justify-center">
          <div className="flex items-center">
            <Button asChild variant="ghost" aria-label="home">
              <Link href={'/'}>
                <FaHome className={cn(iconCss)} />
              </Link>
            </Button>
          </div>
          <div className="content-end flex items-center ml-auto">
            <ToggleThemeButton className="mr-2" />
            {githubUsername && (
              <Button asChild variant="ghost" aria-label="github">
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <FaGithub
                    className={cn(iconCss, isValidAdmin && darkenCss)}
                  />
                </a>
              </Button>
            )}
            {xUsername && (
              <Button asChild variant="ghost" aria-label="x">
                <a
                  href={`https://twitter.com/${xUsername}`}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <FaXTwitter
                    className={cn(iconCss, isValidAdmin && darkenCss)}
                  />
                </a>
              </Button>
            )}
            {discordUsername && (
              <DiscordButton
                username={discordUsername}
                className={cn(iconCss, isValidAdmin && darkenCss)}
              />
            )}
            {misskeyUrl && (
              <Button asChild variant="ghost" aria-label="misskey.io">
                <a
                  href={misskeyUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                >
                  <SiMisskey
                    className={cn(iconCss, isValidAdmin && darkenCss)}
                  />
                </a>
              </Button>
            )}
            {isValidAdmin && (
              <Button asChild variant="ghost" aria-label="admin-dashboard">
                <a href="/admin/dashboard">
                  <FolderLock className={cn(iconCss)} />
                </a>
              </Button>
            )}
            {isValidAdmin && <SignOutNavButton className={cn(iconCss)} />}
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  )
}

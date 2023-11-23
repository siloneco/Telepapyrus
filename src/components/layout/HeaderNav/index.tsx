import Link from 'next/link'
import { FaGithub, FaHome } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiMisskey } from 'react-icons/si'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import DiscordButton from '../DiscordButton'

const iconCss: string = 'text-2xl pr-5 text-white pr-0'

const githubUsername: string | undefined = process.env.PROFILE_GITHUB_USERNAME
const xUsername: string | undefined = process.env.PROFILE_X_USERNAME
const discordUsername: string | undefined = process.env.PROFILE_DISCORD_USERNAME
const misskeyUrl: string | undefined = process.env.PROFILE_MISSKEY_URL

export default function HeaderNav() {
  return (
    <nav className="sticky top-0 shadow-sm">
      <div className="h-14 w-full bg-background flex flex-row justify-center items-center">
        <div className="h-full w-full max-w-4xl flex flex-row content-between items-center justify-center">
          <div className="flex items-center">
            <Button asChild variant="ghost">
              <Link href={'/'}>
                <FaHome className={cn(iconCss)} />
              </Link>
            </Button>
          </div>
          <div className="content-end flex items-center ml-auto">
            {githubUsername && (
              <Button asChild variant="ghost">
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className={cn(iconCss)} />
                </a>
              </Button>
            )}
            {xUsername && (
              <Button asChild variant="ghost">
                <a
                  href={`https://twitter.com/${xUsername}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaXTwitter className={cn(iconCss)} />
                </a>
              </Button>
            )}
            {discordUsername && <DiscordButton username={discordUsername} />}
            {misskeyUrl && (
              <Button asChild variant="ghost">
                <a href={misskeyUrl} target="_blank" rel="noopener noreferrer">
                  <SiMisskey className={cn(iconCss)} />
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
      <Separator />
    </nav>
  )
}

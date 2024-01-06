import { FaDiscord } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import CopyButton from '@/components/misc/CopyButton'

type Props = {
  username: string
  className?: string
}
export default function DiscordButton({ username, className }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" aria-label="discord">
          <FaDiscord className={className} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52">
        <Label className="pl-1">Username</Label>
        <div className="flex flex-row border border-gray-700 rounded-lg p-1.5 pl-2">
          <p>{username}</p>
          <CopyButton className="ml-auto" value={username} />
        </div>
      </PopoverContent>
    </Popover>
  )
}

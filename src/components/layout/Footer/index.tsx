import CopyButton from '@/components/misc/CopyButton'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const textClassName = 'text-center text-foreground dark:text-foreground/60'

const contactEmail = process.env.CONTACT_EMAIL

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto mt-3 mb-6">
      <Separator />
      <div className="mt-3">
        {contactEmail && (
          <p className={cn(textClassName, 'mb-4')}>
            <span>記事の内容に関する指摘等は</span>
            <a
              href={`mailto:${contactEmail}`}
              className="ml-2 text-link underline"
            >
              {contactEmail}
            </a>
            <CopyButton
              value={contactEmail}
              className="h-6 w-6 align-bottom text-card-foreground/60 hover:text-card-foreground/60"
            />
            <span>まで</span>
          </p>
        )}
        <p className={textClassName}>
          Contribute at GitHub:{' '}
          <a
            href="https://github.com/siloneco/Telepapyrus"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-link underline"
          >
            siloneco/Telepapyrus
          </a>
        </p>
      </div>
    </footer>
  )
}

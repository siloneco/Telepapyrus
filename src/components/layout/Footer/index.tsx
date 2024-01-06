import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto mt-3 mb-6">
      <Separator />
      <div className="mt-3">
        <p className="text-center text-foreground dark:text-foreground/60">
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

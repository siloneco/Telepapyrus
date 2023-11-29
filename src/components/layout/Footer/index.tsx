import { Separator } from '@/components/ui/separator'

export default function Footer() {
  return (
    <footer className="max-w-3xl mx-auto mt-3 mb-6">
      <Separator />
      <div className="mt-3">
        <p className="text-center text-gray-400">
          Contribute at GitHub:{' '}
          <a
            href="https://github.com/siloneco/Telepapyrus"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400"
          >
            siloneco/Telepapyrus
          </a>
        </p>
      </div>
    </footer>
  )
}

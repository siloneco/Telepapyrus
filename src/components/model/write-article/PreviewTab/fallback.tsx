import { Button } from '@/components/ui/button'

export function fallbackRender({ error, resetErrorBoundary }: any) {
  return (
    <div className="w-full">
      <div className="w-fit mx-auto">
        <p>
          Failed to load preview. Digest:{' '}
          <span className="text-red-400">{error.digest}</span>
        </p>
      </div>
      <div className="w-fit mx-auto mt-4">
        <Button
          variant={'secondary'}
          onClick={resetErrorBoundary}
          className="text-base"
        >
          Reload
        </Button>
      </div>
    </div>
  )
}

import PageForward from '../PageForward'
import PageBack from '../PageBack'

type Props = {
  currentPage: number
  totalPages: number
  path: string
}

export default function PageSelector({ currentPage, totalPages, path }: Props) {
  const next = Math.max(currentPage + 1, 1)
  const prev = Math.min(currentPage - 1, totalPages)

  return (
    <div className="my-6 text-center">
      {currentPage > 1 && (
        <PageBack path={path} page={prev} bright={currentPage == totalPages} />
      )}
      {currentPage < totalPages && <PageForward path={path} page={next} />}
    </div>
  )
}

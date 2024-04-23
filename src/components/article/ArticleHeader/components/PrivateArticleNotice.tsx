import { Lock } from 'lucide-react'
import { FC } from 'react'

const PrivateArticleNotice: FC = () => (
  <div className="w-full mb-4 px-4 flex flex-row items-center rounded-xl bg-primary/20">
    <div className="w-8">
      <Lock size={24} className="mr-2 text-amber-500 dark:text-yellow-500" />
    </div>
    <p className="py-4 flex-grow">
      この記事はリンクを知っている人のみ閲覧可能です
    </p>
  </div>
)

export default PrivateArticleNotice

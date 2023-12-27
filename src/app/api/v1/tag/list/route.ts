import { NextResponse } from 'next/server'
import { getTagUseCase } from '@/layers/use-case/tag/TagUsesCase'

export const dynamic = 'force-dynamic'

export async function GET(_req: Request) {
  const result = await getTagUseCase().listTags()

  if (result.isFailure()) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 },
    )
  }

  const tags = result.value
  return NextResponse.json(tags, { status: 200 })
}

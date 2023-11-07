import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftArticleCache'
import { PostSubmitFormat } from '@/components/types/PostSubmitFormat'

// This endpoint requires authentication. The blocking is done in middleware.ts
export async function PUT(request: Request) {
    const data: PostSubmitFormat = await request.json()
    await setDraftData(data)
    return NextResponse.json({ status: 'ok' })
}
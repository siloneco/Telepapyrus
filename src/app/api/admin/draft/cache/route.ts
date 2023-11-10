import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftArticleCache'
import { Draft } from '@/components/types/Post'

// This endpoint requires authentication. The blocking is done in middleware.ts
export async function PUT(request: Request) {
    const data: Draft = await request.json()
    await setDraftData(data)
    return NextResponse.json({ status: 'ok' })
}
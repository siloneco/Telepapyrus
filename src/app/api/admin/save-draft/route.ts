import { NextResponse } from 'next/server'
import { setDraftData } from '@/lib/article/DraftArticleCache'

// This endpoint requires authentication. The blocking is done in middleware.ts

export async function PUT(request: Request) {
    const { key, content } = await request.json()
    await setDraftData(key, content)
    return NextResponse.json({ status: 'ok' })
}
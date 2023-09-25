import { NextResponse } from 'next/server'


export async function GET(
    request: Request,
    { params }: { params: { tag: string } }
) {
    return NextResponse.redirect(`http://localhost:3000/api/internal/posts/tag/${params.tag}/1`)
}
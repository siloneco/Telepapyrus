import { NextResponse } from 'next/server'

export async function GET(request: Request) {
    return NextResponse.redirect('http://localhost:3000/api/posts/1')
}
'use client'

import { signOut } from 'next-auth/react'

// TODO: Delete
// This is a debugging page for future implementation of protected pages

export default function Home() {
    return (
        <div>
            <p>This page is protected.</p>
            <button onClick={() => signOut()}>Sign out</button>
        </div>
    )
}
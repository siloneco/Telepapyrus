'use client'

import { useRouter } from 'next/navigation'
import { useContext, useEffect, useState, useTransition } from 'react'
import { TabContext } from '../DraftWorkspace'

export default function DraftPreview({ children }: { children: any }) {
    const router = useRouter()
    const [_, startTransition] = useTransition()
    const { active, registerOnMount } = useContext(TabContext)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        registerOnMount('preview', async () => {
            if (loading) {
                return
            }
            setLoading(true)
            startTransition(() => {
                router.refresh()
                setLoading(false)
            })
        })
    })

    if (loading) {
        return (
            <p>loading...</p>
        )
    }

    if (active !== 'preview') {
        return null
    }

    return (
        <>
            {children}
        </>
    )
}
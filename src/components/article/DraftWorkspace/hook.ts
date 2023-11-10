import { useState, useEffect } from "react"
import { TabState, SwitchEventCallback } from "./type"
import { TabContextProps, IUseDraftWorkspace } from "./type"
import { INTERNAL_BACKEND_HOSTNAME } from "@/lib/constants/API"
import { Draft } from "@/components/types/Post"

const baseUrl: string = process.env.NEXT_PUBLIC_BASEURL || INTERNAL_BACKEND_HOSTNAME

async function cacheDraft(id: string, title: string, content: string) {
    const data: Draft = {
        id: id,
        title: title,
        content: content,
    }

    await fetch(`${baseUrl}/api/admin/draft/cache`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

async function saveDraft(id: string, title: string, content: string) {
    const data: Draft = {
        id: id,
        title: title,
        content: content,
    }

    await fetch(`${baseUrl}/api/admin/draft/save`, {
        method: 'PUT',
        body: JSON.stringify(data),
    })
}

export function useDraftWorkspaceHooks(id: string): IUseDraftWorkspace {
    const [activeTab, setActiveTag] = useState<TabState>('write')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [onMount, setOnMount] = useState<SwitchEventCallback[]>([])

    async function switchTab(tab: TabState) {
        if (activeTab === tab) {
            return
        }

        if (activeTab === 'write') {
            await cacheDraft(id, title, content)
            saveDraft(id, title, content) // don't wait for this
        }

        await onMount.find((e) => e.key === tab)?.fn()

        setActiveTag(tab)
    }

    const registerOnMount = (key: TabState, fn: () => Promise<void>) => {
        if (onMount.find((e) => e.key === key)) {
            return
        }
        setOnMount((prev) => {
            return [...prev, { key: key, fn: fn }]
        })
    }

    const tabContextProviderValue: TabContextProps = {
        active: activeTab,
        setActive: setActiveTag,
        setContent: setContent,
        registerOnMount: registerOnMount,
    }

    useEffect(() => {
        window.onbeforeunload = (e) => {
            if (content.length > 0) {
                e.preventDefault()
                return ''
            }
        }
    })

    return {
        title,
        setTitle,
        content,
        activeTab,
        switchTab,
        tabContextProviderValue,
    }
}
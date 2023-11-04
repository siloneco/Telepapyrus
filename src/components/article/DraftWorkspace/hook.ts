import { useState, useEffect } from "react"
import { TabState, SwitchEventCallback } from "./type"
import { TabContextProps, IUseDraftWorkspace } from "./type"

async function saveDraft(baseUrl: string, id: string, content: string) {
    await fetch(`${baseUrl}/api/admin/save-draft`, {
        method: 'PUT',
        body: JSON.stringify({ key: id, content: content }),
    })
}

export function useDraftWorkspaceHooks(baseUrl: string, id: string): IUseDraftWorkspace {
    const [activeTab, setActiveTag] = useState<TabState>('write')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [onMount, setOnMount] = useState<SwitchEventCallback[]>([])

    async function switchTab(tab: TabState) {
        if (activeTab === tab) {
            return
        }

        if (activeTab === 'write') {
            await saveDraft(baseUrl, id, content)
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
'use client'

import { useState, createContext, useEffect } from 'react'
import { PostSubmitFormat } from '@/components/types/PostSubmitFormat'
import styles from './style.module.css'

type TabState = 'write' | 'preview'

const TabContext = createContext(
    {
        active: 'write',
        setActive: (_tab: TabState) => { },
        setContent: (_content: string) => { },
        registerOnMount: (_key: TabState, _fn: () => Promise<void>) => { },
    }
)

type MountEventFunc = {
    key: string,
    fn: () => Promise<void>,
}

async function postArticle(baseUrl: string, id: string, title: string, content: string, tags: Array<string>) {
    const postObject: PostSubmitFormat = {
        id: id,
        title: title,
        content: content,
        tags: tags,
    }

    const res = await fetch(`${baseUrl}/api/admin/create-post`, {
        method: 'POST',
        body: JSON.stringify(postObject),
    })

    // TODO: implement more safety check and error handling
    if (res.status == 200) {
        console.log('submit success')
    } else {
        console.log('submit failed')
    }
}

export default function DraftWorkspace(
    { id, baseUrl, children }: { id: string, baseUrl: string, children: any }
) {
    const [activeTab, setActiveTag] = useState<TabState>('write')
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')

    const [onMount, setOnMount] = useState<MountEventFunc[]>([])

    async function switchTab(tab: TabState) {
        if (activeTab === tab) {
            return
        }

        if (activeTab === 'write') {
            await fetch(`${baseUrl}/api/admin/save-draft`, {
                method: 'PUT',
                body: JSON.stringify({ key: id, content: content }),
            })
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

    const providerValue = {
        active: activeTab,
        setActive: setActiveTag,
        setContent: setContent,
        registerOnMount: registerOnMount,
    }

    const writeButtonClass = activeTab === 'write' ? `${styles.modeChangeButton} ${styles.modeChangeButtonActive}` : styles.modeChangeButton
    const previewButtonClass = activeTab === 'preview' ? `${styles.modeChangeButton} ${styles.modeChangeButtonActive}` : styles.modeChangeButton

    const minToRead = Math.ceil(content.length / 70) / 10

    useEffect(() => {
        window.onbeforeunload = (e) => {
            if (content.length > 0) {
                e.preventDefault()
                return ''
            }
        }
    })

    return (
        <TabContext.Provider value={providerValue}>
            <div className={styles.mainContainer}>
                <input className={styles.titleInput} placeholder='Title' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <div className={styles.nav}>
                    <button onClick={() => { switchTab('write') }} className={writeButtonClass} disabled={activeTab === 'write'}>Draft</button>
                    <button onClick={() => { switchTab('preview') }} className={previewButtonClass} disabled={activeTab === 'preview'}>Preview</button>
                    <p className={styles.navText}>{minToRead} min to read</p>
                    {/* TODO: implement selecting tags */}
                    <button onClick={() => postArticle(baseUrl, id, title, content, [])} className={styles.submitButton} style={{ marginLeft: 'auto', marginRight: '0px' }}>Submit</button>
                </div>
                {children}
            </div>
        </TabContext.Provider>
    )
}

export { TabContext }
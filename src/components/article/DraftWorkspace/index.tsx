'use client'

import { useState, createContext, useEffect } from 'react'
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

export default function DraftWorkspace({ id, baseUrl, children }: { id: string, baseUrl: string, children: any }) {
    const [activeTab, setActiveTag] = useState<TabState>('write')
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

    const submit = async () => {
        const res = await fetch(`${baseUrl}/api/admin/submit`, {
            method: 'POST',
            body: JSON.stringify({ key: id, content: content }),
        })

        // TODO: implement more safety check and error handling
        if (res.status == 200) {
            console.log('submit success')
        } else {
            console.log('submit failed')
        }
    }

    return (
        <TabContext.Provider value={providerValue}>
            <div className={styles.mainContainer}>
                <div className={styles.nav}>
                    <button onClick={() => { switchTab('write') }} className={writeButtonClass} disabled={activeTab === 'write'}>Draft</button>
                    <button onClick={() => { switchTab('preview') }} className={previewButtonClass} disabled={activeTab === 'preview'}>Preview</button>
                    <p className={styles.navText}>{minToRead} min to read</p>
                    <button onClick={submit} className={styles.submitButton} style={{ marginLeft: 'auto', marginRight: '0px' }}>Submit</button>
                </div>
                {children}
            </div>
        </TabContext.Provider>
    )
}

export { TabContext }
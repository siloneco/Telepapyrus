'use client'

import { createContext } from 'react'
import { Draft } from '@/components/types/Post'
import { TabState } from './type'
import { IUseDraftWorkspace } from './type'
import { useDraftWorkspaceHooks } from './hook'
import { INTERNAL_BACKEND_HOSTNAME } from "@/lib/constants/API"
import clsx from 'clsx'
import styles from './style.module.css'

const baseUrl: string = process.env.NEXT_PUBLIC_BASEURL || INTERNAL_BACKEND_HOSTNAME

export const TabContext = createContext(
    {
        active: 'write',
        setActive: (_tab: TabState) => { },
        setContent: (_content: string) => { },
        registerOnMount: (_key: TabState, _fn: () => Promise<void>) => { },
    }
)

async function postArticle(
    id: string,
    title: string,
    content: string,
    tags: string[]
) {
    const postObject: Draft = {
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

type Props = {
    id: string,
    children: React.ReactNode
}

export default function DraftWorkspace({ id, children }: Props) {
    const {
        title,
        setTitle,
        content,
        activeTab,
        switchTab,
        tabContextProviderValue,
    }: IUseDraftWorkspace = useDraftWorkspaceHooks(id)

    const minToRead = Math.ceil(content.length / 70) / 10

    return (
        <TabContext.Provider value={tabContextProviderValue}>
            <div className={styles.mainContainer}>
                <input className={styles.titleInput} placeholder='Title' value={title} onChange={(e) => { setTitle(e.target.value) }} />
                <div className={styles.nav}>
                    <button
                        onClick={() => { switchTab('write') }}
                        className={clsx(styles.modeChangeButton, activeTab === 'write' && styles.modeChangeButtonActive)}
                        disabled={activeTab === 'write'}
                    >
                        Draft
                    </button>
                    <button
                        onClick={() => { switchTab('preview') }}
                        className={clsx(styles.modeChangeButton, activeTab === 'preview' && styles.modeChangeButtonActive)}
                        disabled={activeTab === 'preview'}
                    >
                        Preview
                    </button>
                    <p className={styles.navText}>{minToRead} min to read</p>
                    {/* TODO: implement selecting tags */}
                    <button onClick={() => postArticle(id, title, content, [])} className={styles.submitButton} style={{ marginLeft: 'auto', marginRight: '0px' }}>Submit</button>
                </div>
                {children}
            </div>
        </TabContext.Provider>
    )
}
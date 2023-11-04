'use client'

import { createContext } from 'react'
import { PostSubmitFormat } from '@/components/types/PostSubmitFormat'
import { TabState } from './type'
import { IUseDraftWorkspace } from './type'
import { useDraftWorkspaceHooks } from './hook'
import styles from './style.module.css'

export const TabContext = createContext(
    {
        active: 'write',
        setActive: (_tab: TabState) => { },
        setContent: (_content: string) => { },
        registerOnMount: (_key: TabState, _fn: () => Promise<void>) => { },
    }
)

async function postArticle(
    baseUrl: string,
    id: string,
    title: string,
    content: string,
    tags: string[]
) {
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

type Props = {
    id: string,
    baseUrl: string,
    children: React.ReactNode
}

export default function DraftWorkspace({ id, baseUrl, children }: Props) {
    const {
        title,
        setTitle,
        content,
        activeTab,
        switchTab,
        tabContextProviderValue,
    }: IUseDraftWorkspace = useDraftWorkspaceHooks(baseUrl, id)

    const writeButtonClass = activeTab === 'write' ? `${styles.modeChangeButton} ${styles.modeChangeButtonActive}` : styles.modeChangeButton
    const previewButtonClass = activeTab === 'preview' ? `${styles.modeChangeButton} ${styles.modeChangeButtonActive}` : styles.modeChangeButton

    const minToRead = Math.ceil(content.length / 70) / 10

    return (
        <TabContext.Provider value={tabContextProviderValue}>
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
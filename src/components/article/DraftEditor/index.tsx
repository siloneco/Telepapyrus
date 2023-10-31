'use client'

import { useContext } from 'react'
import { TabContext } from '../DraftWorkspace'
import styles from './style.module.css'

export default function DraftEditor({ id, baseUrl }: { id: string, baseUrl: string }) {
    const { active, setContent } = useContext(TabContext)

    const display = active === 'write' ? 'block' : 'none'

    return (
        <div style={{ display: display }} className={styles.main}>
            <textarea
                placeholder='# Title'
                className={styles.textarea}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>
    )
}
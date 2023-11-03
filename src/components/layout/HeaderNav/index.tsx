import Link from 'next/link'
import styles from './style.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'
import { FaGithub, FaHome } from 'react-icons/fa'
import { FaXTwitter } from 'react-icons/fa6'
import { SiMisskey } from 'react-icons/si'

export default function HeaderNav() {
    return (
        <nav className={styles.navBackground}>
            <div className={styles.navContent}>
                <div className={styles.leftContent}>
                    <Link href={'/'} className={`${linkStyle.linkWithoutStyle} ${styles.navLinks}`}><FaHome className={styles.simpleIcon} /></Link>
                </div>
                <div className={styles.rightContent}>
                    <a href="https://github.com/siloneco" target='_blank' rel='noopener noreferrer'>
                        <div className={`${linkStyle.linkWithoutStyle} ${styles.navLinks}`}><FaGithub className={styles.simpleIcon} /></div>
                    </a>
                    <a href="https://twitter.com/si1oneco" target='_blank' rel='noopener noreferrer'>
                        <div className={`${linkStyle.linkWithoutStyle} ${styles.navLinks}`}><FaXTwitter className={styles.simpleIcon} /></div>
                    </a>
                    <a href="https://misskey.io/@siloneco" target='_blank' rel='noopener noreferrer'>
                        <div className={`${linkStyle.linkWithoutStyle} ${styles.navLinks}`}><SiMisskey className={styles.simpleIcon} /></div>
                    </a>
                </div>
            </div >
        </nav >
    )
}
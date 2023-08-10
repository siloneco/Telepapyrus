import Link from 'next/link'
import styles from './style.module.css'
import linkStyle from '@/components/style/LinkStyle.module.css'
import { FaHome } from 'react-icons/fa';

export default function HeaderNav() {
    return (
        <nav className={styles.navBackground}>
            <div className={styles.navContent}>
                <Link href={'/'} className={`${linkStyle.linkWithoutStyle} ${styles.navLinks}`}><FaHome style={{ fontSize: '1.5rem', paddingRight: '5px' }} />Home</Link>
            </div>
        </nav>
    )
}
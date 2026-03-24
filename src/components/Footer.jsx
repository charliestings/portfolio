import { FiHeart, FiArrowUp } from 'react-icons/fi'
import styles from './Footer.module.css'

const links = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>

        <a href="#home" className={styles.logo}>
          <span className={styles.s}>S</span>
          <span className={styles.rest}>udharsanan</span>
        </a>

        <nav className={styles.nav}>
          {links.map(l => <a key={l.href} href={l.href} className={styles.link}>{l.label}</a>)}
        </nav>

        <p className={styles.copy}>
          © {new Date().getFullYear()} Sudharsanan — Built with <FiHeart className={styles.heart} />
        </p>

        <a href="#home" className={styles.backTop} aria-label="Back to top">
          <FiArrowUp />
        </a>
      </div>
    </footer>
  )
}

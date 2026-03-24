import { useState, useEffect } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import ScrollProgress from './ScrollProgress'
import styles from './Navbar.module.css'

const links = [
  { label: 'Home',     href: '#home' },
  { label: 'About',    href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact',  href: '#contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive]   = useState('#home')
  const [open, setOpen]       = useState(false)

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50)
      const ids = ['contact','projects','about','home']
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActive(`#${id}`)
          break
        }
      }
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <ScrollProgress />
      <div className={`container ${styles.inner}`}>

        {/* Monogram wordmark */}
        <a href="#home" className={styles.logo}>
          <span className={styles.monogram}>S</span>
          <span className={styles.wordmark}>udharsanan</span>
        </a>

        {/* Desktop nav */}
        <nav className={`${styles.nav} ${open ? styles.open : ''}`}>
          {links.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`${styles.link} ${active === l.href ? styles.activeLink : ''}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <a href="mailto:sudharsanan@example.com" className={`btn btn-primary ${styles.ctaBtn}`}>
            Hire Me
          </a>
        </nav>

        <button className={styles.hamburger} onClick={() => setOpen(o => !o)} aria-label="Toggle menu">
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </header>
  )
}

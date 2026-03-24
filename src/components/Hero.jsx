import { useEffect, useRef, useState } from 'react'
import { FiArrowDown, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi'

import Name3DInline from './Name3DInline'
import useMagnetic from '../hooks/useMagnetic'
import styles from './Hero.module.css'

// Split "Sudharsanan" into an array so we can animate each letter individually
const NAME = 'Sudharsanan'.split('')

const TITLES = [
  'Full Stack Developer',
  'React / Next.js Engineer',
  'UI/UX Craftsman',
  'Problem Solver',
]

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0)
  const [displayed,  setDisplayed]  = useState('')
  const [deleting,   setDeleting]   = useState(false)
  const [nameVisible, setNameVisible] = useState(false)
  const tRef = useRef(null)

  // Magnetic refs
  const ctaRef = useMagnetic(0.3)
  const githubRef = useMagnetic(0.5)
  const linkedinRef = useMagnetic(0.5)

  // Trigger name animation shortly after mount
  useEffect(() => {
    const id = setTimeout(() => setNameVisible(true), 300)
    return () => clearTimeout(id)
  }, [])

  // Typewriter
  useEffect(() => {
    const current = TITLES[titleIndex]
    if (!deleting && displayed.length < current.length) {
      tRef.current = setTimeout(() => setDisplayed(current.slice(0, displayed.length + 1)), 75)
    } else if (!deleting && displayed.length === current.length) {
      tRef.current = setTimeout(() => setDeleting(true), 2400)
    } else if (deleting && displayed.length > 0) {
      tRef.current = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 40)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setTitleIndex(i => (i + 1) % TITLES.length)
    }
    return () => clearTimeout(tRef.current)
  }, [displayed, deleting, titleIndex])

  return (
    <section id="home" className={styles.hero}>
      {/* Ambient background glows */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />



      <div className={`container ${styles.content}`}>

        {/* Status badge */}
        <div className={`${styles.status} ${styles.fadeSlide}`} style={{ animationDelay: '0.1s' }}>
          <span className={styles.dot} />
          <span>Available for work</span>
        </div>

        {/* Greeting */}
        <p className={`${styles.greeting} ${styles.fadeSlide}`} style={{ animationDelay: '0.25s' }}>
          Hi, I'm
        </p>

        {/* 3D Name inline — replaces the old 2D text name */}
        <h1 className="sr-only">Sudharsanan</h1>
        <Name3DInline />

        {/* Typewriter */}
        <div className={`${styles.titleRow} ${styles.fadeSlide}`} style={{ animationDelay: '0.5s' }}>
          <span className={styles.bracket}>{'<'}</span>
          <span className={styles.typewriter}>{displayed}</span>
          <span className={styles.cursor}>|</span>
          <span className={styles.bracket}>{'/>'}</span>
        </div>

        {/* Bio */}
        <p className={`${styles.bio} ${styles.fadeSlide}`} style={{ animationDelay: '0.65s' }}>
          I design and engineer radiant web experiences — combining clean code with
          interfaces that feel premium, purposeful, and fast.
        </p>

        {/* CTAs */}
        <div className={`${styles.ctas} ${styles.fadeSlide}`} style={{ animationDelay: '0.8s' }}>
          <a ref={ctaRef} href="#projects" className={`btn btn-primary ${styles.primaryBtn}`}>
            View My Work <FiArrowDown />
          </a>
          <a href="#contact" className="btn btn-outline">
            <FiMail /> Get in Touch
          </a>
          <div className={styles.socialRow}>
            <a ref={githubRef} href="https://github.com"   target="_blank" rel="noreferrer" className={styles.iconBtn}><FiGithub /></a>
            <a ref={linkedinRef} href="https://linkedin.com" target="_blank" rel="noreferrer" className={styles.iconBtn}><FiLinkedin /></a>
          </div>
        </div>

        {/* Stats */}
        <div className={`${styles.stats} ${styles.fadeSlide}`} style={{ animationDelay: '0.95s' }}>
          {[
            { value: '3+',  label: 'Years Experience' },
            { value: '40+', label: 'Projects Delivered' },
            { value: '20+', label: 'Happy Clients' },
          ].map((s, i) => (
            <div key={s.label} className={styles.stat} style={{ animationDelay: `${1 + i * 0.1}s` }}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div className={`${styles.scrollHint} ${styles.fadeSlide}`} style={{ animationDelay: '1.2s' }}>
        <a href="#about">
          <div className={styles.mouse}><div className={styles.wheel} /></div>
        </a>
      </div>
    </section>
  )
}

import { FiSend, FiGithub, FiLinkedin, FiTwitter, FiMail } from 'react-icons/fi'
import { SiHashnode } from 'react-icons/si'
import Reveal from './Reveal'
import ContactHelix from './ContactHelix'
import styles from './Contact.module.css'

const socials = [
  { icon: <FiGithub />,   label: 'GitHub',   href: 'https://github.com',   desc: '/sudharsanan' },
  { icon: <FiLinkedin />, label: 'LinkedIn', href: 'https://linkedin.com', desc: "Let's connect" },
  { icon: <FiTwitter />,  label: 'Twitter',  href: 'https://twitter.com',  desc: '@sudharsanan' },
  { icon: <SiHashnode />, label: 'Blog',     href: 'https://hashnode.com', desc: 'Read my posts' },
]

export default function Contact() {
  return (
    <section id="contact" className={`section ${styles.contact}`}>
      <div className={styles.radiance} />
      <div className={styles.ring1} />
      <div className={styles.ring2} />
      <ContactHelix />

      <div className="container">
        <div className={styles.wrapper}>
          <Reveal>
            <p className="eyebrow">Get in touch</p>
            <h2 className={`section-title ${styles.heading}`}>
              Have a vision?<br />
              <span className="gradient-text">Let's make it real.</span>
            </h2>
            <p className={styles.sub}>
              Whether it's a product idea, a freelance role, or just a conversation —
              Sudharsanan's inbox is always open.
            </p>
          </Reveal>

          <Reveal delay="0.15s">
            <a href="mailto:sudharsanan@example.com" className={`btn btn-primary ${styles.mailBtn}`}>
              <FiSend /> Send a Message
            </a>
          </Reveal>

          <div className={styles.divider}><span>or reach me on</span></div>

          <div className={styles.socials}>
            {socials.map((s, i) => (
              <Reveal key={s.label} delay={`${i * 0.08}s`}>
                <a href={s.href} target="_blank" rel="noreferrer" className={`glass-card ${styles.socialCard}`}>
                  <div className={styles.socialIcon}>{s.icon}</div>
                  <div className={styles.socialText}>
                    <span className={styles.socialLabel}>{s.label}</span>
                    <span className={styles.socialDesc}>{s.desc}</span>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

import Link from 'next/link'

import styles from './header.module.scss'

export default function Header() {
  return (
    // When clicking on the logo, it is necessary to redirect to the main page (instructions)
    <header className={styles.header}>
      <Link href="/">
        <a>
          <img src="/Logo.svg" alt="logo" />
        </a>
      </Link>
    </header>
  )
}

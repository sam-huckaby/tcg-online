import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link';
import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>TCG Online</title>
        <meta name="description" content="A place for card collectors to come together." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.tiltSection}>
          <h1 className={styles.title}>
            <span id={styles.t_card}>T</span><span id={styles.c_card}>C</span><span id={styles.g_card}>G</span> Online
          </h1>

          <p className={styles.description}>
            Game On.
          </p>
        </div>

        <div className={styles.grid}>
          <Link href="/learn/mtg-getting-started">
            <a className={styles.card}>
              <h2>Learn &rarr;</h2>
              <p>Learn about TCGs and how to play them from experts.</p>
            </a>
          </Link>

          <Link href="/play-groups/find">
            <a className={styles.card}>
              <h2>Play Groups &rarr;</h2>
              <p>Search for people playing your TCG near you.</p>
            </a>
          </Link>

          <Link href="/utils/convert-csv">
            <a className={styles.card}>
              <h2>CSV Convert &rarr;</h2>
              <p>Convert inventory CSVs so you can import anywhere.</p>
            </a>
          </Link>

          <Link href="/marketplace/buy-cards">
            <a className={styles.card}>
              <h2>Purchase &rarr;</h2>
              <p>Find ways to buy new cards to fuel your game.</p>
            </a>
          </Link>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../styles/Home.module.scss';

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
            <div><span id={styles.t_card}>T</span><span id={styles.c_card}>C</span><span id={styles.g_card}>G</span></div>
            <div className={styles['online-subtext']}>Online</div>
          </h1>

          <p className={styles.description}>
            Game On.
          </p>
        </div>

        <div className={styles.grid}>
          <Link href="/utils/mtg-counter">
            <a className={styles.card}>
              <h2>Play Magic &rarr;</h2>
              <p>Use the TCG Online MTG life tracker.</p>
            </a>
          </Link>

          <Link href="/learn/mtg-getting-started">
            <a className={styles.card}>
              <h2>Learn &rarr;</h2>
              <div className={styles['card-description']}>
                <p>Learn about TCGs and how to play them from experts.</p>
                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
              </div>
            </a>
          </Link>

          <Link href="/play-groups/find">
            <a className={styles.card}>
              <h2>Play Groups &rarr;</h2>
              <div className={styles['card-description']}>
                <p>Search for people playing your TCG near you.</p>
                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
              </div>
            </a>
          </Link>

          <Link href="/utils/convert-csv">
            <a className={styles.card}>
              <h2>CSV Convert &rarr;</h2>
              <div className={styles['card-description']}>
                <p>Convert inventory CSVs so you can import anywhere.</p>
                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
              </div>
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

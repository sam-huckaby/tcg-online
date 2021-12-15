import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '/styles/404.module.scss';

const Lost = () => {
    const router = useRouter();
    const { stub } = router.query;
    let missed = '';
    
    if (stub) {
        missed = stub.join('/');
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>TCG Nowhere?</title>
                <meta name="description" content="The page you requested does not appear to exist." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.tiltSection}>
                    <div className={styles['bounding-box']}>
                        <Link href="/">
                            <a>
                                <h1 className={styles['big-title']}>
                                    <span id={styles.t_card}>T</span><span id={styles.c_card}>C</span><span id={styles.g_card}>G</span> Online
                                </h1>
                            </a>
                        </Link>
                        <h1 className={styles.title}>
                            We exhausted our library, but couldn&apos;t find that one.
                        </h1>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Lost

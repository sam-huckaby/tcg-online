import Head from 'next/head'
import { useRouter } from 'next/router';
import styles from '/styles/404.module.scss';

const Lost = () => {
    const router = useRouter();
    const { stub } = router.query;
    console.log(stub);
    let missed = stub.join('/');

    return (
        <div className={styles.container}>
            <Head>
                <title>TCG Nowhere?</title>
                <meta name="description" content="The page you requested does not appear to exist." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className={styles.main}>
                <div className={styles.tiltSection}>
                    <h1 className={styles.title}>
                        We exhausted our library, but couldn't find:
                    </h1>

                    <p className={styles.description}>
                        `/{missed}`
                    </p>
                </div>
            </main>
        </div>
    );
}

export default Lost
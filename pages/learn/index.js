import Head from 'next/head';
import Link from 'next/link';

import MiniHeader from '../../components/common/miniHeader.component';
import MiniFooter from '../../components/common/miniFooter.component';

import styles from '../../styles/learn/learn.module.scss';

export default function LearnHome() {
    return (
        <div className={styles['learn-container']}>
            <Head>
                <title>Learn about TCGs | TCG Online</title>
                <meta name="description" content="Get in-depth information about various TCGs" />
                <meta property="og:title" content="Learn about TCGs | TCG Online" />
                <meta
                    property="og:description"
                    content="Get in-depth information about various TCGs"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MiniHeader></MiniHeader>
            <div className={styles.page}>
                <h1>Select a TCG to learn about.</h1>
                <div className={styles.grid}>
                    <Link href="/learn/mtg">
                        <a className={styles.card}>
                            <h2>Magic: The Gathering</h2>
                            <div className={styles['card-description']}>
                                <p>The TCG from Wizards of the Coast that started it all for many TCG players.</p>
                            </div>
                        </a>
                    </Link>

                    <Link href="/learn/pokemon">
                        <a className={styles.card}>
                            <h2>Pokémon</h2>
                            <div className={styles['card-description']}>
                                <p>The TCG from the Pokémon Company to match the TV show and video game.</p>
                                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
                            </div>
                        </a>
                    </Link>

                    <Link href="/learn/yugioh">
                        <a className={styles.card}>
                            <h2>Yu-Gi-Oh!</h2>
                            <div className={styles['card-description']}>
                                <p>One of the early TV show TCGs with a more Egyptian theme.</p>
                                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
                            </div>
                        </a>
                    </Link>

                    <Link href="/learn/mtg">
                        <a className={styles.card}>
                            <h2>Flesh and Blood</h2>
                            <div className={styles['card-description']}>
                                <p>A relatively new TCG that seeks to succeed where others have failed.</p>
                                <div className={styles['coming-soon']}><span>Coming Soon!</span></div>
                            </div>
                        </a>
                    </Link>
                </div>
            </div>
            <MiniFooter></MiniFooter>
        </div>
    );
}
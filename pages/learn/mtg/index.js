import groq from 'groq';
import Link from 'next/link';
import Head from 'next/head';

import client from '../../../client';

import MiniHeader from '../../../components/common/miniHeader.component';
import MiniFooter from '../../../components/common/miniFooter.component';

import styles from '../../../styles/learn/mtg/home.module.scss';

const MagicLearnHome = ({ posts }) => {
    return (
        <div className={styles['post-container']}>
            <Head>
                <title>Learn about Magic: The Gathering | TCG Online</title>
                <meta name="description" content="Get in-depth information about Magic: The Gathering TCG" />
                <meta property="og:title" content="Learn about Magic: The Gathering | TCG Online" />
                <meta
                    property="og:description"
                    content="Get in-depth information about Magic: The Gathering TCG"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <MiniHeader></MiniHeader>
            <div className={styles.page}>
                <h1>Learn About Magic: The Gathering</h1>
                <div className={styles.grid}>
                {posts.length > 0 && posts.map(
                    ({ _id, title = 'Untitled', slug = '', publishedAt = '', summary = '' }) =>
                        slug && (
                            <Link href={`/learn/mtg/${slug.current}`} key={'LINK_' + _id}>
                                <a key={'ANCHOR_' + _id} className={styles.card}>
                                    <h2>{title}</h2>
                                    <span className={styles['post-date']}>{new Date(publishedAt).toDateString()}</span>
                                    <div className={styles['card-description']}>
                                        <p>{summary}.</p>
                                    </div>
                                </a>
                            </Link>
                        )
                )}
                </div>
            </div>
            <MiniFooter></MiniFooter>
        </div>
    );
}
  
export async function getStaticProps(context) {
    // Search for posts that have the Magic: The Gathering category attached to them
    const posts = await client.fetch(groq`
            *[
                _type == "post" &&
                publishedAt < now() &&
                references(*[_type == "category" && title == $keyword]._id)
            ] | order(publishedAt desc) {
                title,
                slug,
                publishedAt,
                summary,
                categories[] -> {
                    title
                },
            }
    `, {
        "keyword": "Magic: The Gathering"
    });
    
    return {
        props: {
            posts
        }
    };
}

export default MagicLearnHome;
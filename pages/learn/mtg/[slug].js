import groq from 'groq';
import BlockContent from '@sanity/block-content-to-react'
import Head from 'next/head';

import client from '../../../client';

import MiniHeader from '../../../components/common/MiniHeader';
import ArticleFooter from '../../../components/common/MiniFooter';

import styles from '../../../styles/learn/mtg/post.module.scss';

const Post = (props) => {
    // If this is the Node side loading there won't be any post data loaded
    if (!props.post) {
        props.post = {};
    }

    const { title = 'Missing title', summary = 'No summary provided', name = 'Unknown', categories, body = [] } = props.post
    
    return (
        <div>
            <MiniHeader></MiniHeader>
            <article className={styles.article}>
                <Head>
                    <title>{title} | TCG Online</title>
                    <meta name="description" content="{summary}" />
                    <meta property="og:title" content="{title} | TCG Online" />
                    <meta
                        property="og:description"
                        content="{summary}"
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <h1>{title}</h1>
                <span className={styles['author-name']}>By {name}</span>
                {categories && (
                    <ul className={styles['category-list']}>
                        {categories.map(category => <li key={category} className={styles['category-name']}>{category}</li>)}
                    </ul>
                )}
                <BlockContent
                    blocks={body}
                    imageOptions={{ w: 320, h: 240, fit: 'max' }}
                    {...client.config()}
                />
            </article>
            <ArticleFooter></ArticleFooter>
        </div>
    );
}

export async function getStaticPaths() {
    const paths = await client.fetch(
        `*[_type == "post" && defined(slug.current)][].slug.current`
    );
  
    return {
        paths: paths.map((slug) => ({params: {slug}})),
        fallback: true,
    };
}
  
export async function getStaticProps(context) {
    // It's important to default the slug so that it doesn't return "undefined"
    const { slug = "" } = context.params;
    const post = await client.fetch(
        groq`*[_type == "post" && slug.current == $slug][0]{
                title,
                summary,
                "name": author->name,
                "categories": categories[]->title,
                body
            }`
        , { slug }
    );
    
    return {
        props: {
            post
        }
    };
}

export default Post;
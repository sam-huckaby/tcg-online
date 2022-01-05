import React, { Component } from 'react';
import Image from 'next/image';

import styles from '../../styles/common/miniFooter.module.scss';


class MiniFooter extends Component {
    // This constructor may be unnecessary
    constructor(props) {
        super(props);
    }

    render() {
        let thisYear = new Date().getFullYear();

        return (
            <div className={styles['footer-container']}>
                <div className={styles.copyright}>&copy; {thisYear} TCG Online</div>
                <div className={styles.vercel}>
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
                </div>
                <div className={styles['samhuckaby-container']}>
                    <span className={styles['built-by']}>Built by</span><a href="https://samhuckaby.com/" target="_blank" className={styles['sam-huckaby-logo']}>Sam Huckaby</a>
                </div>
            </div>
            
        );
    }
}

export default MiniFooter;
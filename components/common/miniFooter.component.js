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
                <span className={styles.copyright}>&copy; {thisYear} TCG Online</span>
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
            
        );
    }
}

export default MiniFooter;
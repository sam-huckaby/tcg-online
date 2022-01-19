import React, { Component } from 'react';
import Link from 'next/link';

import styles from '../../styles/common/MiniHeader.module.scss';

export default function MiniHeader() {
    return (
        <div className={styles['header-container']}>
            <div className={styles.tiltSection}>
                <Link href="/" passHref={true}>
                    <div className={styles.title}>
                        <div><span id={styles.t_card}>T</span><span id={styles.c_card}>C</span><span id={styles.g_card}>G</span></div>
                        <div className={styles['online-subtext']}>Online</div>
                    </div>
                </Link>
            </div>
        </div>
    );
}
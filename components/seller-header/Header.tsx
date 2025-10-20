import React from 'react';
import styles from './header.module.scss';
import Image from 'next/image';


interface seller {
    seller: string | undefined
}

const Header = ({seller}:seller) => {
    return (
        <>
            <div className={styles.header}>
                <div>
                    <Image width={154} height={30} src="/blocq-logo-black.svg" alt='' />
                </div>
                <div className={styles.right}>
                    <div className={styles.notification}>
                        <Image src="/notification-icon.svg" width={15} height={15} alt="" />
                    </div>
                    <div className={styles.user}>
                        <Image src="/avatar.svg" width={32} height={32} alt="" />
                        <p>{seller}</p>
                        <Image src="/arrow-down-filled.svg" width={9} height={4} alt="" />
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <h2>UseBlocq</h2>
                <p>Letter of credit invitation</p>
            </div>
        </>
    )
}

export default Header
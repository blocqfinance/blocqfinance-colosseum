"use client";
import React from 'react';
import styles from './onboarding-success.module.scss';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const OnboardingSuccess = () => {
    const router = useRouter();
    return (
        <div className={styles.login}>
            <div className={styles.login__left}>
                <div className={styles.left_inner}>
                    <div>
                        <Image src={"/logo-black.svg"} width={292} height={54} alt="logo" />
                    </div>
                    <form className={styles.form}>
                        <Image className={styles.image} src="/flower.svg" width={80} height={80} alt="reset password icon" />
                        <h2>Thank you for completing your registration!</h2>
                        <p>You will be receiving via email login credentials to your BlocqFinance application in a few minutes.</p>
                    </form>
                    <button className={`${styles.button} btn-primary`} onClick={() => router.push('/auth/login')}>
                        Login
                        <span style={{ marginLeft: 20 }}>
                            <Image src="/arrow-right.svg" width={29} height={18} alt="login" />
                        </span>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default OnboardingSuccess
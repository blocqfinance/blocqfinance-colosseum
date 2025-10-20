"use client";
import React from 'react';
import styles from './sign-up.module.scss'
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignUp = () => {
    const router = useRouter();
    return (
        <div className={styles.login}>
            <div className={styles.login__left}>
                <div className={styles.left_inner}>
                    <div>
                        <Image src={"/logo-black.svg"} width={292} height={54} alt="logo" />
                    </div>
                    <form className={styles.form}>
                        <h2>Sign Up</h2>
                        <p>Sign up with your Email address</p>
                        <div>
                            <input placeholder='Email*' />
                        </div>
                        <div>
                            <input placeholder='Create Password*' />
                        </div>
                    </form>
                    <div className={styles.button_container}>
                        <p>Already have an account?{" "}
                            <Link href="/auth/login">
                                <span style={{ textDecoration: 'underline' }}>Login</span>
                            </Link>
                        </p>
                    </div>
                    <button className={`${styles.button} btn-primary`} onClick={() => router.push('/auth/onboarding')}>
                        Proceed
                        <span style={{ marginLeft: 20 }}>
                            <Image src="/arrow-right.svg" width={29} height={18} alt="login" />
                        </span>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default SignUp
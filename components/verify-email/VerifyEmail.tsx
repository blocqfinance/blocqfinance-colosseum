import React from 'react';
import styles from './verify-email.module.scss';
import Image from 'next/image';
import Link from 'next/link';

const VerifyEmail = () => {
    return (
        <div className={styles.login}>
            <div className={styles.login__left}>
                <div className={styles.left_inner}>
                    <div>
                        <Image src={"/logo-black.svg"} width={292} height={54} alt="logo" />
                    </div>
                    <form className={styles.form}>
                        <h2>Confirm Email</h2>
                        <p>Enter the 6 digit code sent to your email address</p>
                        <div>
                            <input placeholder='Enter code*' />
                        </div>
                    </form>
                    <div className={styles.button_container}>
                        <p>Didnt get any code?{" "}
                            <Link href="/auth/login">
                                <span style={{ textDecoration: 'underline' }}>Request again</span>
                            </Link>
                        </p>
                    </div>
                    <button className={`${styles.button} btn-primary`}>
                        Proceed
                        <span style={{ marginLeft: 20 }}>
                            <Image src="/arrow-right.svg" width={29} height={18} alt="login" />
                        </span>
                    </button>
                </div>
            </div>
            {/* <div className={styles.login__right}>
                <div className={styles.image_container}>
                    <Image src="/login-image.svg" style={{ objectFit: 'cover', width: '100%', height: '100%' }} alt="" width={0} height={0} />
                    <div className={styles.language_selector}>
                        <p>English</p>
                        <Image src={"/world.svg"} alt="language selector" width={21} height={21} />
                    </div>
                    <div className={styles.right_text}>
                        <p>
                            Blocq Finance exists to level the playing field in international commerce. We provide the trust, speed, and security modern businesses need to grow beyond borders
                        </p>
                    </div>
                </div>
            </div> */}
        </div >
    )
}

export default VerifyEmail
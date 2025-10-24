"use client"
import React, { useState } from 'react';
import styles from './reset-password.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { SubmitHandler, useForm } from 'react-hook-form';
import { changePass, resetPassword } from '@/libs/api/collections/auth';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '../toast/ToastContext';

interface ChangeInput {
    newPassword: string;
    confirmPassword: string;
}
interface ResetInput {
    email: string;
}

interface ApiResponse {
    statusCode: number;
    message: string;
    data: Array<object>
}


const ResetPassword = () => {
    const { showToast } = useToast()
    const [loading, setLoading] = useState(false);
    const router = useRouter()
    const params = useSearchParams()
    const code = params.get("code");

    const {
        handleSubmit,
        register,
        watch,
        reset,
        formState: { errors, isSubmitting, isValid }
    } = useForm<ChangeInput & ResetInput>({
        defaultValues: {
            email: '',
            newPassword: '',
            confirmPassword: '',
        }
    });

    const onSubmit: SubmitHandler<ResetInput> = async (data) => {
        setLoading(true)
        console.log(data);

        const response: ApiResponse = await resetPassword(data)
        if (response.statusCode === 201 || response.statusCode === 200) {
            showToast("success", response.message);
            console.log(response.data)
            setLoading(false);
            reset()
        } else {
            showToast("error", response.message);
            setLoading(false);
            // showToast("error", "Login failed. Please try again.");
        }
    }
    const changePassword: SubmitHandler<ChangeInput> = async (data) => {
        setLoading(true)
        const mainData = {
            "code": code,
            "new_password": data.newPassword
        }

        const response: ApiResponse = await changePass(mainData)
        if (response.statusCode === 201 || response.statusCode === 200) {
            showToast("success", response.message);
            console.log(response.data)
            setLoading(false);
            reset();
            router.replace("/auth/login")
        } else {
            showToast("error", response.message);
            setLoading(false);
            // showToast("error", "Login failed. Please try again.");
        }
    }

    return (
        <div className={styles.login}>
            <div className={styles.login__left}>
                <div className={styles.left_inner}>
                    <div>
                        <Image src={"/logo-black.svg"} width={292} height={54} alt="logo" />
                    </div>
                    {code ? (
                        <React.Fragment>
                            <form className={styles.form}>
                                <Image className={styles.image} src="/lock.svg" width={80} height={80} alt="reset password icon" />
                                <h2>Change your password</h2>
                                <p>Please enter your new password below</p>
                                <div className=''>
                                    <input
                                        placeholder='New password*'
                                        {...register('newPassword', {
                                            required: 'New password',
                                            minLength: {
                                                value: 8,
                                                message: 'Password must contain at least 8 characters',
                                            },
                                            pattern: {
                                                value:
                                                    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{4,}$/,
                                                message:
                                                    'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
                                            },
                                        })}
                                        type='password'
                                    />
                                    <br />
                                    {errors.newPassword && (
                                        <span className="form-error">{`${errors.newPassword.message}`}</span>
                                    )}
                                </div>
                                <div className=''>
                                    <input
                                        placeholder='Confirm password*'
                                        {...register('confirmPassword', {
                                            required: 'Confirm password',
                                            validate: (value) => value === watch("newPassword") || "The passwords do not match"
                                        })}
                                        type='password'
                                    />
                                    <br />
                                    {errors.confirmPassword && (
                                        <span className="form-error">{`${errors.confirmPassword.message}`}</span>
                                    )}
                                </div>
                            </form>
                            <button
                                type='submit'
                                onClick={handleSubmit(changePassword)}
                                className={`${styles.button} btn-primary`}
                                disabled={loading || isSubmitting}
                            >
                                {loading || isSubmitting ? 'Loading...' : 'Change your password'}
                            </button>
                            <p style={{ marginTop: 20, fontSize: 20 }}>Didn t receive a confirmation email?{" "}
                                <Link href="/auth/reset-password">
                                    <span style={{ textDecoration: 'underline' }}>Request a new one</span>
                                </Link>
                            </p>
                            <p style={{ marginTop: 20, fontSize: 20 }}>Already have an account?{" "}
                                <Link href="/auth/login">
                                    <span style={{ textDecoration: 'underline' }}>Login</span>
                                </Link>
                            </p>
                        </React.Fragment>
                    ) : (
                        <React.Fragment>
                            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
                                <Image className={styles.image} src="/lock.svg" width={80} height={80} alt="reset password icon" />
                                <h2>Reset your password</h2>
                                <p>Forgot your password? Please enter your email and we ll send you<br /> a link to set a new password</p>
                                <div className=''>
                                    <input
                                        placeholder='Email Address*'
                                        {...register('email', {
                                            required: 'Email address is required',
                                            pattern: {
                                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                message: 'Please enter a valid email address'
                                            }
                                        })}
                                    />
                                    <br />
                                    {errors.email && (
                                        <span className="form-error">{`${errors.email.message}`}</span>
                                    )}
                                </div>
                            </form>
                            <button
                                type='submit'
                                onClick={handleSubmit(onSubmit)}
                                className={`${styles.button} btn-primary`}
                                disabled={loading || isSubmitting}
                            >
                                {loading || isSubmitting ? 'Loading...' : 'Reset Password'}
                                <span style={{ marginLeft: 20 }}>
                                    <Image src="/arrow-right.svg" width={29} height={18} alt="login" />
                                </span>
                            </button>
                            <p style={{ marginTop: 20, fontSize: 20 }}>Already have an account?{" "}
                                <Link href="/auth/login">
                                    <span style={{ textDecoration: 'underline' }}>Login</span>
                                </Link>
                            </p>
                        </React.Fragment>
                    )}

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

export default ResetPassword
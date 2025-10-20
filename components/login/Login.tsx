'use client'
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import styles from './login.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import { login, resendOtp, verify } from '@/libs/api/collections/auth';
import Otp from '../OtpModal/Otp';
import Backdrop from '../backdrop/Backdrop';
import useAuthStore from '@/store/AuthStore';
import { useToast } from '../toast/ToastContext';
import { BlocqSpinnerPulse } from '../Loader/Loader';

interface LoginFormInputs {
  email: string;
  password: string;
}


interface ApiData {
  accessToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown; // for future user fields
  };
}


interface ApiResponse {
  statusCode: number;
  message: string;
  error?: string;
  data: ApiData;
}

const Login: React.FC = () => {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [showOtp, setShowOtp] = useState(false);
  const logIn = useAuthStore().login;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm<LoginFormInputs>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const email = watch('email');

  const callLogin: SubmitHandler<LoginFormInputs> = async (data) => {
    setLoading(true);

    const mainData = {
      email: data.email,
      password: data.password,
    };

    const response: ApiResponse = await login(mainData);

    if (response.statusCode === 201 || response.statusCode === 200) {
      showToast('success', response.message);
      setShowOtp(true);
    } else {
      showToast('error', response.error ?? 'Login failed. Please try again.');
    }

    setLoading(false);
  };

  const verifyLogin = async (otp: string) => {
    setLoading(true);

    const mainData = {
      email,
      otp,
    };

    const response: ApiResponse = await verify(mainData);

    if (response.statusCode === 201 || response.statusCode === 200) {
      logIn(response?.data?.accessToken, true, response?.data?.user);
      showToast('success', response?.message);
      router.push('/dashboard/');
    } else {
      showToast('error', response?.message);
    }

    setLoading(false);
  };

  const resend = async () => {
    setLoading(true);

    const mainData = { email };
    const response: ApiResponse = await resendOtp(mainData);

    if (response.statusCode === 201 || response.statusCode === 200) {
      showToast('success', 'OTP resent successfully.');
    } else {
      showToast('error', response.message);
    }

    setLoading(false);
  };

  return (
    <>
      {showOtp && (
        <Backdrop>
          <Otp
            showOtp={showOtp}
            setShowOtp={setShowOtp}
            onSubmit={verifyLogin}
            // submit={resend}
            email={email}
          />
        </Backdrop>
      )}

      {loading && (
        <Backdrop>
          <BlocqSpinnerPulse />
        </Backdrop>
      )}

      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.left_inner}>
            <div>
              <Image src={'/logo-black.svg'} width={292} height={54} alt="logo" />
            </div>

            <form className={styles.form} onSubmit={handleSubmit(callLogin)}>
              <h2>Login</h2>
              <p>Please enter your account details</p>

              <div className="input">
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address',
                    },
                  })}
                  placeholder="Email*"
                  type="email"
                  disabled={loading || isSubmitting}
                  className={errors.email ? styles.error : ''}
                />
                {errors.email && <span className="form-error">{errors.email.message}</span>}
              </div>

              <div className="input">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters long',
                    },
                  })}
                  placeholder="Password*"
                  type="password"
                  disabled={loading || isSubmitting}
                  className={errors.password ? styles.error : ''}
                />
                {errors.password && (
                  <span className="form-error">{errors.password.message}</span>
                )}
              </div>

              <div className={styles.button_container}>
                <Link className={styles.text} href={'/auth/signup'}>
                  <p>Create an account</p>
                </Link>
                <Link className={styles.text} href={'/auth/reset-password'}>
                  <p>Forgot password</p>
                </Link>
              </div>

              <button
                type="submit"
                className={`${styles.button} btn-primary`}
                disabled={loading || isSubmitting}
              >
                {loading || isSubmitting ? 'Logging in...' : 'Login'}
                <span style={{ marginLeft: 20 }}>
                  <Image src="/arrow-right.svg" width={29} height={18} alt="login" />
                </span>
              </button>
            </form>
          </div>
        </div>

        <div className={styles.login__right}>
          <div className={styles.image_container}>
            <Image
              src="/login-image.svg"
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              alt=""
              width={0}
              height={0}
            />
            <div className={styles.language_selector}>
              <p>English</p>
              <Image src={'/world.svg'} alt="language selector" width={21} height={21} />
            </div>
            <div className={styles.right_text}>
              <p>
                Blocq Finance exists to level the playing field in international commerce. We
                provide the trust, speed, and security modern businesses need to grow beyond
                borders.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

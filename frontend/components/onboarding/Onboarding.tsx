"use client";
import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import styles from './onboarding.module.scss';
import Image from 'next/image';
import { signup } from '@/libs/api/collections/auth';
import Backdrop from '../backdrop/Backdrop';
import { BlocqSpinnerPulse } from '../Loader/Loader';
import { useToast } from '../toast/ToastContext';
import Link from 'next/link';


interface OnboardingFormInputs {
  firstName: string;
  lastName: string;
  address: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  companyId: string;
  country: string;
  city: string;
  postalCode: string;
  carrier: string;
  otherCarrier?: string;
  businessType: 'importer' | 'exporter' | '';
  acceptedTerms: boolean;
}


interface SignupData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  country: string;
  city: string;
  postalCode: string;
  phone: string;
  importerOrExporter: 'importer' | 'exporter';
  createdAt?: string;
  updatedAt?: string;
}


interface ApiResponse {
  statusCode: number;
  message: string;
  data?: SignupData;
}

const Onboarding: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<OnboardingFormInputs>({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      address: '',
      email: '',
      phoneNumber: '',
      companyName: '',
      companyId: '',
      country: '',
      city: '',
      postalCode: '',
      carrier: '',
      otherCarrier: '',
      businessType: '',
      acceptedTerms: false,
    },
  });

  const selectedCarrier = watch('carrier');

  const onSubmit: SubmitHandler<OnboardingFormInputs> = async (data) => {
    setLoading(true);

    const formData = {
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      companyName: data.companyName,
      country: data.country,
      city: data.city,
      postalCode: data.postalCode,
      importerOrExporter: data.businessType,
      phone: data.phoneNumber,
    };

    const response: ApiResponse = await signup(formData);
    console.log(response);

    if (response.statusCode === 201 || response.statusCode === 200) {
      setLoading(false);
      showToast('success', 'Registration successful');
      router.push('/auth/onboarding/success');
    } else {
      showToast('error', response.message);
      setLoading(false);
    }
  };

  const getErrorMessage = (fieldName: keyof OnboardingFormInputs) => {
    const error = errors[fieldName];
    if (error?.message) {
      return <span className="form-error">{error.message}</span>;
    }
    return null;
  };

  return (
    <>
      {loading && (
        <Backdrop>
          <BlocqSpinnerPulse />
        </Backdrop>
      )}

      <div className={styles.login}>
        <div className={styles.login__left}>
          <div className={styles.left_inner}>
            <div>
              <Image src="/logo-black.svg" width={292} height={54} alt="logo" />
            </div>

            <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
              <h2>Welcome to BlocqFinance</h2>
              <p>
                Filing out this registration form is the first step toward joining our digital trade document
                management system.
                <br />
                We re here to ensure your journey starts on the right foot.
              </p>

              <div className={styles.form_group}>
                <div className={styles.row_one}>
                  <div className={styles.column_one}>
                    <input
                      {...register('firstName', {
                        required: 'First name is required',
                        minLength: { value: 2, message: 'First name must be at least 2 characters' },
                      })}
                      placeholder="First name*"
                      disabled={loading || isSubmitting}
                      className={errors.firstName ? styles.error : ''}
                    />
                    {getErrorMessage('firstName')}
                  </div>

                  <div className={styles.column_one}>
                    <input
                      {...register('lastName', {
                        required: 'Last name is required',
                        minLength: { value: 2, message: 'Last name must be at least 2 characters' },
                      })}
                      placeholder="Last name*"
                      disabled={loading || isSubmitting}
                      className={errors.lastName ? styles.error : ''}
                    />
                    {getErrorMessage('lastName')}
                  </div>

                  <div className={styles.column_two}>
                    <input
                      {...register('address', { required: 'Address is required' })}
                      placeholder="Address*"
                      disabled={loading || isSubmitting}
                      className={errors.address ? styles.error : ''}
                    />
                    {getErrorMessage('address')}
                  </div>

                  <div className={styles.column_two}>
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
                    {getErrorMessage('email')}
                  </div>
                </div>

                <div className={styles.row_two}>
                  <div className={styles.column_one}>
                    <input
                      {...register('phoneNumber', {
                        required: 'Phone number is required',
                        // pattern: {
                        //   value: /^[+]?[\d\s\-\(\)]{8,}$/,
                        //   message: 'Please enter a valid phone number',
                        // },
                      })}
                      placeholder="Phone Number*"
                      type="tel"
                      disabled={loading || isSubmitting}
                      className={errors.phoneNumber ? styles.error : ''}
                    />
                    {getErrorMessage('phoneNumber')}
                  </div>

                  <div className={styles.column_one}>
                    <input
                      {...register('companyName', { required: 'Company name is required' })}
                      placeholder="Company Name*"
                      disabled={loading || isSubmitting}
                      className={errors.companyName ? styles.error : ''}
                    />
                    {getErrorMessage('companyName')}
                  </div>

                  <div className={styles.column_one}>
                    <input
                      {...register('companyId', { required: 'Company ID is required' })}
                      placeholder="Company ID*"
                      disabled={loading || isSubmitting}
                      className={errors.companyId ? styles.error : ''}
                    />
                    {getErrorMessage('companyId')}
                  </div>
                </div>

                <div className={styles.row_three}>
                  <div className={styles.column_one}>
                    <select
                      {...register('country', { required: 'Country is required' })}
                      disabled={loading || isSubmitting}
                      className={errors.country ? styles.error : ''}
                    >
                      <option value="">Country*</option>
                      <option value="Nigeria">Nigeria</option>
                      <option value="Ghana">Ghana</option>
                      <option value="Kenya">Kenya</option>
                      <option value="South Africa">South Africa</option>
                    </select>
                    {getErrorMessage('country')}
                  </div>

                  <div className={styles.column_one}>
                    <input
                      {...register('city', { required: 'City is required' })}
                      placeholder="City*"
                      disabled={loading || isSubmitting}
                      className={errors.city ? styles.error : ''}
                    />
                    {getErrorMessage('city')}
                  </div>

                  <div className={styles.column_two}>
                    <input
                      {...register('postalCode', { required: 'Postal code is required' })}
                      placeholder="Postal Code*"
                      disabled={loading || isSubmitting}
                      className={errors.postalCode ? styles.error : ''}
                    />
                    {getErrorMessage('postalCode')}
                  </div>

                  <div className={styles.column_one}>
                    <select
                      {...register('carrier', { required: 'Carrier is required' })}
                      disabled={loading || isSubmitting}
                      className={errors.carrier ? styles.error : ''}
                    >
                      <option value="">Choose Carrier*</option>
                      <option value="DHL">DHL</option>
                      <option value="FedEx">FedEx</option>
                      <option value="UPS">UPS</option>
                      <option value="Maersk">Maersk</option>
                      <option value="other">Other</option>
                    </select>
                    {getErrorMessage('carrier')}
                  </div>

                  {selectedCarrier === 'other' && (
                    <div className={styles.column_one}>
                      <input
                        {...register('otherCarrier', {
                          required: selectedCarrier === 'other' ? 'Please specify other carrier' : false,
                        })}
                        placeholder="Other Carrier*"
                        disabled={loading || isSubmitting}
                        className={errors.otherCarrier ? styles.error : ''}
                      />
                      {getErrorMessage('otherCarrier')}
                    </div>
                  )}
                </div>

                <div className={styles.row_four}>
                  <div className={styles.column_two}>
                    <select
                      {...register('businessType', { required: 'Business type is required' })}
                      disabled={loading || isSubmitting}
                      className={errors.businessType ? styles.error : ''}
                    >
                      <option value="">Are you an importer or exporter*</option>
                      <option value="importer">Importer</option>
                      <option value="exporter">Exporter</option>
                    </select>
                    {getErrorMessage('businessType')}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className={`${styles.button} btn-primary`}
                onClick={handleSubmit(onSubmit)}
              >
                {loading || isSubmitting ? 'Registering...' : 'Register'}
                <span style={{ marginLeft: 20 }}>
                  <Image src="/arrow-right.svg" width={29} height={18} alt="register" />
                </span>
              </button>
            </form>

            <div className={styles.button_container}>
                        <p>Already have an account?{" "}
                            <Link href="/auth/login">
                                <span style={{ textDecoration: 'underline' }}>Login</span>
                            </Link>
                         </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Onboarding;

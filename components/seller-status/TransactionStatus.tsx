import React, { useRef, useState, ChangeEvent } from 'react';
import Image from 'next/image';
import styles from './status.module.scss';
import { ReactSVG } from 'react-svg';
import { useParams } from 'next/navigation';
import Cookies from 'js-cookie';
import Backdrop from '../backdrop/Backdrop';
import Otp from '../OtpModal/Otp';
import { sendOtp } from '@/libs/api/collections/seller';
import { useToast } from '../toast/ToastContext';

interface ActivityLog {
  message: string;
  action: string;
  updated_at: string;
}

type Buyer = {
    companyName: string;
};

type LcResponse = {
    amount: number;
    buyer: Buyer;
    goodsDescription: string;
    shippingDeadline: string;
    sellerEmail: string;
    requiredDocument: string;
    contractAddress: string;
    lcId?: string;
    status?: string;
    blocqId: string
    sellerCompany:string
    activityLogs?: ActivityLog[];
};

interface TransactionStatusProps {
  response: LcResponse | null;
  type: string | undefined;
  documentType: string | undefined;
  email: string | undefined;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({
  response,
  type,
  documentType,
  email,
}) => {
  const [lcFunded, setLcFunded] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const param = useParams<{ id: string }>();
  const ref = useRef<HTMLInputElement | null>(null);
  const { showToast } = useToast();

  const transactionStatus = [
    {
      id: 1,
      title: 'LC Terms Accepted',
      subtitle: 'You have confirmed participation',
      completed: true,
    },
    {
      id: 2,
      title: 'Upload Trade Documents',
      subtitle: 'Available after LC is funded',
      completed:
        response?.activityLogs?.[3]?.message === 'Document has been uploaded'
          ? true
          : false,
    },
    {
      id: 3,
      title: 'Receive Payment',
      subtitle: 'Payment released after document verification',
      completed:
        response?.activityLogs?.[5]?.action === 'Payment Released'
          ? true
          : false,
    },
  ];

  const setOtpFunction = (otpValue: string) => {
    setOtp(otpValue);
    setShowOtp(false);
  };

  const callUpload = () => {
    if (ref.current) {
      ref.current.click();
    }
  };

  const handleUpload = async (file: File) => {
    if (!file) {
      console.error('No file provided');
      return;
    }

    if (!email) {
      showToast('error', 'Email is required');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('document', file);
      formData.append('otp', otp);
      formData.append('email', email);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}lc/${param.id}/upload-document`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${Cookies.get('token') || ''}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (response.ok) {
        showToast('success', 'Document uploaded successfully');
      } else {
        showToast('error', data?.message || 'Document upload failed');
      }
    } catch (err) {
      console.error('Error uploading document:', err);
      showToast('error', 'An error occurred while uploading');
    }
  };

  const callOtp = async () => {
    if (!email) {
      showToast('error', 'Email is required');
      return;
    }

    const data = { email };
    const responseData = await sendOtp(data);

    if (responseData.statusCode === 201 || responseData.statusCode === 200) {
      setShowOtp(true);
      showToast('success', responseData.message);
    } else {
      showToast('error', responseData.message);
    }
  };

  return (
    <>
      {showOtp && (
        <Backdrop>
          <Otp
            showOtp={showOtp}
            setShowOtp={setShowOtp}
            onSubmit={setOtpFunction}
            email={email}
          />
        </Backdrop>
      )}

      <div className={styles.container}>
        {type === 'status' && (
          <div className={styles.confirm}>
            <div className={styles.header}>
              <h4>Transaction Status</h4>
              <p>Track the progress of your LC transaction</p>
            </div>

            {transactionStatus.map((status, index) => (
              <div key={status.id} className={styles.status_trail}>
                <div>
                  <div className={styles.status_circle}>
                    {status.completed ? (
                      <Image
                        src="/transaction-success.svg"
                        width={30}
                        height={30}
                        alt="transaction status"
                      />
                    ) : (
                      <Image
                        src="/transaction-pending.svg"
                        width={30}
                        height={30}
                        alt="transaction status"
                      />
                    )}
                    {index !== transactionStatus.length - 1 && (
                      <div className={styles.line} />
                    )}
                  </div>
                  <div>
                    <div className={styles.status_text}>
                      <h4>
                        {status.title}
                        {status.completed && (
                          <span>
                            <Image
                              src="/check.svg"
                              width={14}
                              height={14}
                              alt="check"
                            />
                          </span>
                        )}
                      </h4>
                      <p>{status.subtitle}</p>
                    </div>
                  </div>
                </div>
                {status.completed && (
                  <p className={styles.time}></p>
                )}
              </div>
            ))}

            {/* <button className={styles.confirm_btn}>
              Confirm Participating in LC
              <span>
                <Image
                  src="/check-white.svg"
                  width={16}
                  height={16}
                  alt=""
                />
              </span>
            </button> */}
          </div>
        )}

        {type === 'documents' && (
          <div className={styles.confirm}>
            <div className={styles.header}>
              <h4>Required Documents</h4>
              <p>Upload trade documents (available after LC funding)</p>
            </div>

            <div className={styles.inner}>
              <div className={styles.options}>
                <div>
                  <Image
                    src="/document-circled.svg"
                    width={40}
                    height={40}
                    alt="upload document"
                  />
                  <div>
                    <h4>{documentType?.toUpperCase() || 'DOCUMENT'}</h4>
                    <p>Required</p>
                  </div>
                </div>

                <input
                  type="file"
                  ref={ref}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleUpload(file);
                    }
                  }}
                  style={{ display: 'none' }}
                />

                <button
                  onClick={otp ? callUpload : callOtp}
                  className={styles.upload_btn}
                >
                  <span>
                    {lcFunded ? (
                      <ReactSVG src="/upload-fill.svg" width={20} height={20} />
                    ) : (
                      <ReactSVG
                        src="/upload-fill-2.svg"
                        width={20}
                        height={20}
                      />
                    )}
                  </span>
                  {otp ? 'Upload' : 'Request OTP and Upload'}
                </button>
              </div>

              <div className={styles.info_orange}>
                <ReactSVG
                  src="/information-fill-orange.svg"
                  width={16}
                  height={16}
                />
                Document upload will be enabled once the LC is funded by the
                buyer.
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default TransactionStatus;
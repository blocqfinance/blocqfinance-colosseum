import React, { useEffect, useState } from 'react'
import { ReactSVG } from 'react-svg'
import styles from './progress.module.scss'
import Image from 'next/image'
import { DateTime } from 'luxon';
import { lcStatus } from '@/app/utils/status';

interface ActivityLog {
  message: string;
  action: string;
  updated_at: string;
}

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
  sellerCompany: string
  activityLogs: ActivityLog[];
};

type Buyer = {
  companyName: string;
};


interface SellerProgressProps {
  response: LcResponse | null
}

const SellerProgress: React.FC<SellerProgressProps> = ({ response }) => {
  const [progress, setProgress] = useState<number>(0)
  const totalSteps = 6

  useEffect(() => {
    const calculateProgress = () => {
      const stepCount = response?.activityLogs?.length || 0
      const eachStepPercentage = (stepCount / totalSteps) * 100
      setProgress(Math.round(eachStepPercentage))
    }

    calculateProgress()
  }, [response])

 const formatDate = (dateString: string | undefined) => {
    const dt = DateTime.fromISO(dateString || '')
    return dt.isValid ? dt.toFormat('ff') : ''
  }


  return (
    <div className={styles.main}>
      <div className={styles.summary}>
        <h5>LC Summary</h5>

        <div>
          <p>Amount</p>
          <h6>${response?.amount} USDC</h6>
        </div>
        <div>
          <p>Deadline</p>
          <h6>{DateTime.fromISO(`${response?.shippingDeadline}`).toFormat("dd LLL, yyyy")}</h6>
        </div>
        <div>
          <p>Status</p>
          <div>
            <ReactSVG src="/bank-card-line.svg" width={12} height={12} />
            <p>{lcStatus[response?.status ?? ""]}</p>
          </div>
        </div>
      </div>

      <div className={styles.progress}>
        <h5>LC Progress</h5>

        <div className={styles.progress__box}>
          <div>
            <h4>LC Progress</h4>
            <p>{progress}%</p>
          </div>

          <ReactSVG src="/progress.svg" />
        </div>

        <div className={styles.progress__main}>
          {[
            'LC Created',
            'Escrow Funded',
            'Seller Invited',
            'Document Uploaded',
            'Goods Delivered',
            'Payment Released',
          ].map((label, index) => (
            <div key={index}>
              <div>
                <h4>
                  Step {index + 1}/{totalSteps}
                </h4>
                {response?.activityLogs?.[index] && (
                  <span style={{ marginLeft: 5 }}>
                    <Image src="/check.svg" width={14} height={14} alt="check" />
                  </span>
                )}
              </div>
              <p>{label}</p>
              <h6>{formatDate(response?.activityLogs?.[index]?.updated_at)}</h6>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.contact}>
        <h5>Need Help?</h5>
        <h6>Have questions about LC?</h6>
        <button className={styles.contact_btn}>
          Contact{' '}
          <span>
            <Image src="/arrow-r.svg" width={20} height={20} alt="contact support" />
          </span>
        </button>
      </div>
    </div>
  )
}

export default SellerProgress

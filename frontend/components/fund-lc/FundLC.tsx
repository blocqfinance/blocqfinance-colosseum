"use client";
import React, { useState } from 'react';
import styles from './fund-lc.module.scss';
import Image from 'next/image';


interface LcData {
  lcId: string;
  sellerCompany: string;
  shippingDeadline: string;
  amount: number;
}

interface FundLCProps {
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
  data: LcData;
  fundLc: () => void;
}

const FundLC: React.FC<FundLCProps> = ({ activeStep, fundLc, setActiveStep, data }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
console.log(data);
  return (
    <>
      <div className={styles.fund}>
        <div className={styles.lc_form}>
          <div className={styles.lc_form_header}>
            <Image src="/box.svg" width={20} height={20} alt="lc form header" />
            <h2>Fund Letter of Credit</h2>
            <Image src="/information-tooltip.svg" width={12} height={12} alt="input" />
          </div>
        </div>

        <div className={styles.escrow_text}>
          <Image src="/information-tooltip-orange.svg" width={20} height={20} alt="input" />
          <div>
            <h3>Secure Escrow Funding</h3>
            <p>
              Your funds will be held securely in a smart contract escrow. The seller will only be invited after successful
              funding, ensuring they know the LC is fully backed.
            </p>
          </div>
        </div>

        <div className={styles.summary}>
          <div className={styles.summary_box}>
            <div className={styles.summary_header}>
              <Image src="/box.svg" width={20} height={20} alt="lc form header" />
              <h2>LC Summary</h2>
            </div>
            <div className={styles.summary_details}>
              <div>
                <h3>LC ID:</h3>
                <p>{data.lcId}</p>
              </div>

              <div>
                <h3>Seller:</h3>
                <p>{data.sellerCompany}</p>
              </div>
              <div>
                <h3>Deadline:</h3>
                <p>{data.shippingDeadline}</p>
              </div>
            </div>
          </div>

          <div className={styles.summary_box}>
            <div className={styles.summary_header}>
              <Image src="/box.svg" width={20} height={20} alt="lc form header" />
              <h2>Funding Details</h2>
            </div>
            <div className={styles.summary_details}>
              <div>
                <h3>LC Amount:</h3>
                <p>${data.amount}</p>
              </div>
              <div>
                <h3>Platform Fee:</h3>
                <p>$70.80</p>
              </div>
              <div>
                <h3>Total Required:</h3>
                <p style={{ fontWeight: 700 }}>$478.80</p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.buttons}>
          <button className={styles.back} onClick={() => setActiveStep(activeStep - 1)}>
            <Image src="/arrow-left.svg" width={20} height={20} alt="continue" />
            Back to LC Details
          </button>
          <button onClick={fundLc} className={styles.continue}>
            <Image src="/wallet-icon.svg" width={20} height={20} alt="continue" />
            Fund LC
          </button>
        </div>
      </div>
    </>
  );
};

export default FundLC;

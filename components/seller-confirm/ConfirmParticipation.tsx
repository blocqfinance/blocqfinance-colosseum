import React, { useState } from 'react';
import Image from 'next/image';
import styles from './confirm.module.scss'
import { ReactSVG } from 'react-svg';

interface ConfirmParticipationProps {
    setActiveStep: (step: number) => void;
}

const ConfirmParticipation: React.FC<ConfirmParticipationProps> = ({ setActiveStep }) => {
    const [checked, setChecked] = useState(false)
    
    return (
        <div className={styles.confirm}>
            <div className={styles.header}>
                <h4>Confirm Your Participation</h4>
                <p>Verify your wallet address and accept the LC terms</p>
            </div>

            <div className={styles.connect_success}>
                <Image src="/circled-green-check.svg" width={20} height={20} alt="wallet connected" />
                <div>
                    <h4>Wallet Connected Successfully</h4>
                    <p>0x742d35Cc6634C0532925a3b8D4C9db96590c6C87</p>
                </div>
            </div>

            <div className={styles.address}>
                <h4>Your Wallet Address<span>*</span></h4>
                <div className={styles.container}>
                    0x742d35Cc6634C0532925a3b8D4C9db96590c6C87
                </div>
            </div>

            <div className={styles.info}>
                <ReactSVG src="/information-fill.svg" width={16} height={16} />
                This address will receive the payment upon successful completion
            </div>

            <div className={styles.info_orange}>
                <ReactSVG src="/information-fill-orange.svg" width={16} height={16} />
                Make sure this wallet address is correct. Payments cannot be reversed once sent.
            </div>

            <div className={styles.accept}>
                <div
                    className={styles.checkbox}
                    style={checked ? { background: '#171717' } : { background: '#A3A3A3' }}
                    onClick={() => setChecked(!checked)}
                >
                    <ReactSVG src="/check-white.svg" width={6} height={9} />
                </div>
                <div>
                    <h4>I accept the terms and conditions of this Letter of Credit</h4>
                    <p>By accepting, you agree to fulfill all requirements and upload necessary documents.</p>
                </div>
            </div>

            <button className={styles.confirm_btn} onClick={() => setActiveStep(4)}>
                Confirm Participating in LC
                <span>
                    <Image src="/check-white.svg" width={16} height={16} alt="" />
                </span>
            </button>
        </div>
    )
}

export default ConfirmParticipation
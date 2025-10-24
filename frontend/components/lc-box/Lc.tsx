import React from 'react'
import { ReactSVG } from 'react-svg'
import styles from './lc.module.scss'
import { addCommas } from '@/app/utils/currency';
import { DateTime } from 'luxon';
import { useRouter } from 'next/navigation';
import { lcStatus, lcStatusColor } from '@/app/utils/status';

interface LcData {
    id: string;
    lcId?: string;
    status: string;
    created_at: string;
    goodsDescription?: string;
    sellerCompany?: string;
    currency?: string;
    shippingDeadline: string;
    amount?: number;
    sellerEmail: string;
}

interface LcProps {
    lcData: LcData;
}

const Lc: React.FC<LcProps> = ({ lcData }) => {
    const router = useRouter();
    return (
        <div className={styles.lc}>
            <ReactSVG src='/Brand.svg' />

            <div className={styles.lc__header}>
                <h4>{lcData?.lcId?.toUpperCase()}</h4>
                <div>
                    <p style={{color: lcStatusColor[lcData.status], fontWeight: 600}}>
                        {lcStatus[lcData.status] || lcData.status}
                    </p>
                </div>
            </div>
            <div className={styles.lc__main}>
                <div>
                    <h4>Amount</h4>
                    <p>${lcData?.amount ? addCommas(lcData?.amount) : '0'}{" "}{lcData?.currency?.toUpperCase()}</p>
                </div>

                <div>
                    <h4>Seller</h4>
                    <p>{lcData?.sellerCompany}</p>
                </div>

                <div>
                    <h4>Goods</h4>
                    <p>{lcData?.goodsDescription}</p>
                </div>

                <div>
                    <h4>Created</h4>
                    <p>{DateTime.fromISO(lcData?.created_at).toFormat("d LLL, yyyy")}</p>
                </div>

                <div style={{ borderBottom: '0px !important' }}>
                    <h4>Deadline</h4>
                    <p>{DateTime.fromISO(lcData?.shippingDeadline).toFormat("d LLL, yyyy")}</p>
                </div>
            </div>

            {lcData?.status === "funded" && (
                <div className={styles.lc__alert}>
                    <ReactSVG src='/spam.svg' />
                    <p>LC funded and invitation sent to {lcData?.sellerEmail} - awaiting seller acceptance</p>
                </div>
            )}
            <button onClick={() => router.push(`/dashboard/lc-management/${lcData?.lcId}`)}>
                <ReactSVG src='/eye-line.svg' />
                <p>View Details</p>
            </button>
        </div>
    )
}

export default Lc
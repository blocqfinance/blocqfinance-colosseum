'use client'
import React, { useEffect, useState } from 'react'
import styles from './lc.module.scss'
import { ReactSVG } from 'react-svg'
import Progress from '../Progress/Progress'
import { useParams, useRouter } from 'next/navigation'
import useSWR from 'swr'
import { getSingleLc } from '@/libs/api/collections/lc'
import { addCommas } from '@/app/utils/currency'
import { lcStatus } from '@/app/utils/status'
import { DateTime } from 'luxon'

interface ActivityLog {
    id: string
    action: string
    updated_at: string
  }

interface SingleLcData {
    lcId: string;
    amount: number;
    currency?: string;
    sellerCompany?: string;
    status: string;
    goodsDescription?: string;
    created_at?: string;
    shippingDeadline?: string;
    contractAddress?: string;
    activityLogs: ActivityLog[]
    requiredDocument?: string
    documentUrl?:string
}

const Lc = () => {
    const params = useParams();
    const paramsId = params.id
    const [singleLcData, setSingleLcData] = useState<SingleLcData>()
    const router = useRouter()
    const [showDocument, setShowDocument] = useState(false)
    const { data, error } = useSWR(`lc/${paramsId}`, getSingleLc)

    useEffect(() => {
        const singleData = data?.data
        setSingleLcData(singleData)
    }, [data, error, paramsId]);

    // Type-safe access to lcStatus
    const getStatusText = (status?: string) => {
        if (!status) return '';
        return (lcStatus as Record<string, string>)[status] || status;
    };

    return (
        <div className={styles.lcm}>
            <div className={styles.lcm__header}>
                <div className={styles.header}>
                    <h1>{singleLcData?.lcId?.toUpperCase()}</h1>
                    <p>Letter of Credit Details</p>
                </div>
            </div>

            <div className={styles.lcm__main}>
                <div>
                    <button onClick={() => setShowDocument(false)} className={showDocument ? '' : styles.active}>Overview</button>
                    <button onClick={() => setShowDocument(true)} className={showDocument ? styles.active : ''}>Document</button>
                </div>
            </div>

            <div className={styles.lcm__details}>
                {!showDocument ? <>
                    <div className={styles.lcm__details__one}>
                        <div className={styles.header}>
                            <h4>LC Details</h4>
                            <p>Letter of credit details</p>
                        </div>

                        <div className={styles.main}>
                            <div>
                                <h4>Amount</h4>
                                <p>${singleLcData?.amount ? addCommas(singleLcData.amount) : '0'}{" "}{singleLcData?.currency?.toUpperCase()}</p>
                            </div>

                            <div>
                                <h4>Seller</h4>
                                <p>{singleLcData?.sellerCompany}</p>
                            </div>

                            <div>
                                <h4>Status</h4>
                                <p>{getStatusText(singleLcData?.status)}</p>
                            </div>

                            <div>
                                <h4>Goods Description</h4>
                                <p>{singleLcData?.goodsDescription}</p>
                            </div>

                            <div>
                                <h4>Created</h4>
                                <p>{singleLcData?.created_at ? DateTime.fromISO(singleLcData.created_at).toFormat("d LLL, yyyy") : '-'}</p>
                            </div>

                            <div style={{ borderBottom: '0px !important' }}>
                                <h4>Deadline</h4>
                                <p>{singleLcData?.shippingDeadline ? DateTime.fromISO(singleLcData.shippingDeadline).toFormat("d LLL, yyyy") : '-'}</p>
                            </div>
                        </div>

                        <div className={styles.link}>
                            <ReactSVG src='/link.svg' />
                            <p>{singleLcData?.contractAddress}</p>
                        </div>

                        {/* <div className={styles.actions}>
                            <div>
                                <ReactSVG src='/apps-line.svg' />
                                <h4>Quick Actions</h4>
                            </div>

                            <div className={styles.actions__main}>
                                <button className={styles.release}>Activate Refund</button>
                                <button className={styles.contact}>Contact Seller</button>
                                <button className={styles.report}>Generate Report</button>
                            </div>
                        </div> */}

                        {/* <div className={styles.actions}>
                            <div>
                                <ReactSVG src='/link (1).svg' />
                                <h4>Smart Contract</h4>
                            </div>

                            <div className={styles.actions__view}>
                                <button className={styles.address}>{singleLcData?.contractAddress}</button>
                                <button 
                                    className={styles.view}
                                >
                                    <ReactSVG src='/eye-line.svg' />
                                    View on Explorer
                                </button>
                            </div>
                        </div> */}
                    </div>
                </> :
                    <div className={styles.lcm__details__one}>
                        <div className={styles.header}>
                            <h4>Required Documents</h4>
                            <p>Upload and manage trade documents</p>
                        </div>


                        <div className={styles.line}></div>


                        <div className={styles.doc}>
                                    <div>
                                        <ReactSVG src='/documents.svg' />
                                        <div>
                                            <h4>{singleLcData?.requiredDocument}</h4>
                                            {/* <div>
                                                <p>120 KB</p>
                                            </div> */}
                                        </div>
                                    </div>

                                    <button 
                                        style={{color: '#ffffff', cursor: 'pointer'}}
                                        onClick={() => {
                                            if (singleLcData?.documentUrl) {
                                                window.open(singleLcData.documentUrl, '_blank', 'noopener,noreferrer');
                                            }
                                        }}
                                    >
                                        Download
                                    </button>
                                </div>
                    </div>}
                <Progress singleLcData={singleLcData} />
            </div>
        </div>
    )
}

export default Lc
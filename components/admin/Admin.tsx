'use client'
import React, { useEffect, useState } from 'react'
import styles from '../seller-lc/lc.module.scss'
import { ReactSVG } from 'react-svg'
import Header from '../seller-header/Header'
import Image from 'next/image'
import { useParams, useSearchParams } from 'next/navigation'
import useSWR from 'swr'
import { fetchLC } from '@/libs/api/collections/seller'
import Backdrop from '../backdrop/Backdrop'
import Otp from '../OtpModal/Otp'
import { useToast } from '../toast/ToastContext'
import Wallet from '../Wallet/Admin'

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
};

const Admin = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [response, setResponse] = useState<LcResponse | null>(null);
    const searchParams = useSearchParams();
    const id = searchParams.get('id')
    const [showModal, setShowModal] = useState(false)
    const {showToast} = useToast()
    const { data, error } = useSWR(`public/lc/${id}`, fetchLC)
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setResponse(data?.data)
        const info = data?.data
    }, [data, error]);

    return (
        <>
        {showModal && <Backdrop>
            <Wallet paramId={id} blocqId={response?.blocqId} id={response?.lcId} />
        </Backdrop>}
        <div className={styles.lcm}>
            {/* <Header /> */}
            <div className={styles.lcm__details}>
                {activeStep === 1 && (
                    <div className={styles.lcm__details__one}>
                        <div className={styles.header}>
                            <h4>Letter of Credit Details</h4>
                            <p>
                                Review the LC terms and conditions
                            </p>
                        </div>

                        <div className={styles.main}>
                            <div>
                                <h4>Amount</h4>
                                <p>${response?.amount}USDC</p>
                            </div>

                            <div>
                                <h4>Buyer</h4>
                                <p>{response?.buyer?.companyName}</p>
                            </div>

                            <div>
                                <h4>Goods Description</h4>
                                <p>{response?.goodsDescription}</p>
                            </div>

                            <div style={{ borderBottom: '0px !important' }}>
                                <h4>Shipping Deadline</h4>
                                <p>{response?.shippingDeadline}</p>
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <div className={styles.header}>
                                <h4>Terms & Conditions</h4>
                                <p>Please review all terms carefully before proceeding</p>
                            </div>
                            <div className={styles.inner}>
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
                                <button onClick={()=> setShowModal(true)}  className={styles.confirm_btn}>
                                    Connect Wallet and release funds
                                    <span>
                                        <Image src="/arrow-r-white" width={12} height={12} alt="" />
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    )
}

export default Admin
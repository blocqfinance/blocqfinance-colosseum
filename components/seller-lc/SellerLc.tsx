'use client'
import React, { useEffect, useState } from 'react'
import styles from './lc.module.scss'
import { ReactSVG } from 'react-svg'
import Progress from '../Progress/Progress'
import Header from '../seller-header/Header'
import SellerProgress from '../SellerProgress/SellerProgress'
import Image from 'next/image'
import ConfirmParticipation from '../seller-confirm/ConfirmParticipation'
import TransactionStatus from '../seller-status/TransactionStatus'
import { useParams } from 'next/navigation'
import useSWR from 'swr'
import { fetchLC, sendOtp, verifyOtpCall } from '@/libs/api/collections/seller'
import Backdrop from '../backdrop/Backdrop'
import Otp from '../OtpModal/Otp'
import Wallet from '../Wallet/seller'
import { useToast } from '../toast/ToastContext'
import { DateTime } from 'luxon'

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
    blocqId: string;
    sellerCompany: string;
    activityLogs: [];
};

const SellerLc = () => {
    const [activeStep, setActiveStep] = useState(1);
    const [type, setType] = useState("status")
    const [response, setResponse] = useState<LcResponse | null>(null);
    const { id } = useParams()
    const [showOtp, setShowOtp] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const { showToast } = useToast()
    const { data, error } = useSWR(`public/lc/${id}`, fetchLC)
    const [checked, setChecked] = useState(false);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        setResponse(data?.data)
        console.log(data?.data)
        const info = data?.data
        if (data?.data?.status === 'active' || data?.data?.status === 'documentSubmitted') {
            setActiveStep(2)
        }
    }, [data, error]);

    const terms = [
        { id: 1, term: "Goods must be delivered within 30 days of LC activation" },
        { id: 2, term: "All items must meet specified quality standards as per attached specifications" },
        { id: 3, term: "Shipping insurance required with minimum coverage of LC amount" },
        { id: 4, term: "Payment released upon successful document verification and delivery confirmation" },
        { id: 5, term: "All documents must be uploaded within 48 hours of shipment" },
    ]

    const callOtp = async () => {
        setLoading(true)
        const data = {
            "email": response?.sellerEmail
        }
        const responseData = await sendOtp(data)
        if (responseData.statusCode === 201 || responseData.statusCode === 200) {
            showToast('sucess', responseData.message)
            setShowOtp(true)
            setLoading(false)
        } else {
            showToast('error', responseData.message)
            setLoading(false)
        }
    }

    const verifyOtp = async (otp: string) => {
        setLoading(true)
        const data = {
            "email": response?.sellerEmail,
            "otp": otp
        }
        const responseData = await verifyOtpCall(data)
        if (responseData.statusCode === 201 || responseData.statusCode === 200) {
            setShowOtp(false)
            setShowModal(true)
            showToast('sucess', responseData.message)
            setLoading(false)
        } else {
            showToast('error', responseData.message)
            setLoading(false)
        }
    }

    const close = ()=>{
        setShowOtp(false)
        setShowModal(false)
    }



    return (
        <>
            {showOtp && <Backdrop>
                <Otp close={close} showOtp={showOtp} setShowOtp={setShowOtp} onSubmit={verifyOtp} email={response?.sellerEmail} />
            </Backdrop>}

            {showModal && <Backdrop>
                <Wallet close={close} blocqId={response?.blocqId} id={response?.lcId} />
            </Backdrop>}
            <div className={styles.lcm}>
                <Header seller={response?.sellerCompany} />

                {activeStep === 2 && (
                    <div className={styles.options}>
                        <div>
                            <button onClick={() => setType("status")} className={type === "status" ? styles.active : ""}>Transaction Status</button>
                            <button onClick={() => setType("documents")} className={type === "documents" ? styles.active : ""}>Document</button>
                        </div>

                    </div>
                )}

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
                                    <p>{response?.shippingDeadline ? DateTime.fromISO(response?.shippingDeadline).toFormat("d LLL, yyyy") : '-'}</p>
                                </div>
                            </div>

                            <div className={styles.actions}>
                                <div className={styles.header}>
                                    <h4>Terms & Conditions</h4>
                                    <p>Please review all terms carefully before proceeding</p>
                                </div>
                                <div className={styles.inner}>
                                    {terms.map((item) => (
                                        <div key={item.id}>
                                            <div className={styles.number}>{item.id}</div>
                                            <p>{item.term}</p>
                                        </div>
                                    ))}
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
                                    <button className={styles.confirm_btn} onClick={() => callOtp()}>
                                        {loading ? <div className='loader'></div> : "Connect Wallet and confirm participation"}
                                        {/* <span>
                                        <Image src="/arrow-r-white" width={12} height={12} alt="" />
                                    </span> */}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* {activeStep === 2 && (
                    <React.Fragment>
                        <ConnectWallet setActiveStep={setActiveStep} />
                    </React.Fragment>
                )} */}

                    {/* {activeStep === 2 && (
                    <React.Fragment>
                        <ConfirmParticipation setActiveStep={setActiveStep} />
                    </React.Fragment>
                )} */}

                    {activeStep === 2 && (
                        <React.Fragment>
                            <TransactionStatus response={response} email={response?.sellerEmail} documentType={response?.requiredDocument} type={type} />
                        </React.Fragment>
                    )}

                    <SellerProgress response={response} />
                </div>
            </div>
        </>
    )
}

export default SellerLc
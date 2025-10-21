"use client";
import React, { useState, useEffect } from 'react';
import styles from './create-lc.module.scss';
import Image from 'next/image';
import FundLC from '../fund-lc/FundLC';
import { set, useForm } from 'react-hook-form';
import { createLcFunction, updateLcAsFunded } from '@/libs/api/collections/lc';
import useAuthStore from '@/store/AuthStore';
import { useToast } from '../toast/ToastContext';
import { ethers } from 'ethers';
import Wallet from '../Wallet/ConnectWalletModal';
import Backdrop from '../backdrop/Backdrop';
import CONTRACT_ABI from '../../app/utils/LetterOfCredit.json'
import Link from 'next/link';
import { BlocqSpinnerPulse } from '../Loader/Loader';
import {useSolProvider} from "../../solana/lcsolprovider";

interface LcFormData {
    amount: string;
    sellerEmail: string;
    sellerCompany: string;
    description: string;
    deadline: string;
    docType: string;
}

interface LcData {
    lcId: string;
    amount: number;
    sellerEmail: string;
    sellerCompany: string;
    shippingDeadline: string;
}

const CreateLC = () => {
    const [activeStep, setActiveStep] = useState<number>(1);
    const { user } = useAuthStore()
    const [data, setData] = useState<LcData | null>(null)
    const { showToast } = useToast()
    //ethers state
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [loading, setLoading] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnected, setIsConnected] = useState(false)
    const [showModal, setShowModal] = useState(false)
    const [blocqId, setBlocqId] = useState('')
    const [contractAmount, setContractAmount] = useState('');
    const data2 = useSolProvider();
    if (!data2) return;
    useEffect(()=>{
        console.log(data2);
    },[data2]);

    const CONTRACT_ADDRESS = "0x3c6Fa322551607a547A1DA8f09DFd3F664F386Bf"

    const USDC_ABI = [
       
    ] as const;


    const USDC_ADDRESS = ""

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch
    } = useForm<LcFormData>({
        mode: 'onChange',
        defaultValues: {
            amount: '',
            sellerEmail: '',
            sellerCompany: '',
            description: '',
            deadline: '',
            docType: ''
        }
    });


    const createLC = async (formData: LcFormData) => {
        setLoading(true)
        
    };



    const disconnectWallet = () => {
        setSigner(null);
        setWalletAddress('');
        setIsConnected(false)
    };



    const createLc = async (formData: LcFormData, id: string) => {
        setLoading(true)
        const mainData = {
            "buyer": user?.id,
            "sellerEmail": formData.sellerEmail,
            "sellerCompany": formData?.sellerCompany,
            "amount": Number(formData?.amount),
            "currency": "usdc",
            "goodsDescription": formData?.description,
            "shippingDeadline": formData.deadline,
            "requiredDocument": formData?.docType,
            "blocqId": id
        }

        // console.log(mainData)

        const response = await createLcFunction(mainData)
        console.log(response)
        if (response.statusCode === 201 || response.statusCode === 200) {
            console.log(response)
            const { data } = response
            setActiveStep(2)
            setData(data)
            showToast('success', 'Letter of Credit created successfully!');
            setLoading(false);
        } else {
            showToast("error", "Letter of credit creation failed");
            setLoading(false);
        }
    }

    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };



    const fundLC = async () => {
       
    };

    const updateLc = async () => {
        setLoading(true)
        const mainData = {
            "trigger": "fundLC",
            "buyerWalletAddress": walletAddress
        }
        console.log(data)
        if (!data?.lcId) return;

        const response = await updateLcAsFunded(data.lcId, mainData)
        if (response.statusCode === 201 || response.statusCode === 200) {
            console.log(response)
            showToast('success', 'LC sent to seller');
            setActiveStep(3)
            setLoading(false)
        } else {
            console.log(response)
            setLoading(false)
        }
    }

    const select = watch('docType')
    console.log(select)


    return (
        <>
            {showModal &&
                <Backdrop>
                    <Wallet
                        setWalletAddress={setWalletAddress}
                        setIsConnected={setIsConnected}
                        setSigner={setSigner}
                        setProvider={() => { }}
                        setShowModal={setShowModal}
                    />
                </Backdrop>
            }


            {loading && (
                <Backdrop>
                <BlocqSpinnerPulse />
                </Backdrop>
            )}
            <div className={styles.create}>
                <div className={styles.create__header}>
                    <div className={styles.header}>
                        <h1>Create New Letter of Credit</h1>
                        <p>Fund your LC and invite your seller</p>
                    </div>

                    <div className={styles.walletbtn}>
                        <button onClick={() => !isConnected && setShowModal(true)}>{isConnected ? formatAddress(walletAddress) : 'Connect Wallet'}</button>
                        {isConnected && <button onClick={disconnectWallet} className={styles.disconnect}>Disconnect</button>}
                    </div>
                </div>
                <div className={styles.create__body}>
                    <div className={styles.lc_steps}>
                        <div className={styles.lc_step}>
                            <div>
                                <div className={`${styles.circle} ${activeStep === 1 ? styles.active : ''}`}>1</div>
                                <p className={`${activeStep === 1 ? styles.active : ''}`}>LC Details</p>
                            </div>
                            <Image src="/arrow-right-line.svg" width={20} height={20} alt="arrow right" />
                        </div>
                        <div className={styles.lc_step} style={{ marginLeft: '15px' }}>
                            <div>
                                <div className={styles.circle}>2</div>
                                <p className={`${activeStep === 2 ? styles.active : ''}`}>Fund LC</p>
                            </div>
                            <Image src="/arrow-right-line.svg" width={20} height={20} alt="arrow right" />
                        </div>
                        <div className={styles.lc_step} style={{ marginLeft: '15px' }}>
                            <div>
                                <div className={styles.circle}>3</div>
                                <p  className={`${activeStep === 3 ? styles.active : ''}`}>Send Invitation</p>
                            </div>
                            {/* <Image src="/arrow-right-line.svg" width={20} height={20} alt="arrow right" /> */}
                        </div>
                    </div>
                    <div className={styles.lc_form_body}>
                        {activeStep === 1 && (
                            <div className={styles.lc_form}>
                                <div className={styles.lc_form_header}>
                                    <Image src="/box.svg" width={20} height={20} alt="lc form header" />
                                    <h2>Fill in the details for your Letter of Credit</h2>
                                </div>
                                <form>
                                    <div className={styles.form_input}>
                                        <div>
                                            <h3>Financial Details</h3>
                                            <label>LC Amount (USDC)<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                            <div>
                                                <Image className={styles.input_icon} src="/circled-dollar.svg" width={24} height={24} alt="usdc" />
                                                <input
                                                    {...register('amount', {
                                                        required: 'Enter LC amount',
                                                        min: { value: 0.01, message: 'Amount must be greater than 0' },
                                                        validate: (value) => !isNaN(Number(value)) || 'Must be a valid number'
                                                    })}
                                                    placeholder='00.00'
                                                    type="number"
                                                    step="0.01"
                                                    className={errors.amount ? styles.error : ''}
                                                />
                                                {errors.amount && (
                                                    <span className="form-error">{errors.amount.message}</span>
                                                )}
                                                <p>Enter the total amount in USDC for this Letter of Credit</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.form_input_secondary}>
                                        <h3>Seller Information</h3>
                                        <div className={styles.form_input_secondary_item}>
                                            <div>
                                                <label>Seller Email<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                                <div>
                                                    <Image className={styles.input_icon} src="/mail.svg" width={24} height={24} alt="usdc" />
                                                    <input type="text" placeholder="seller@income.com"
                                                        {...register('sellerEmail', {
                                                            required: 'Enter seller email',
                                                        })}
                                                        className={errors.sellerEmail ? styles.error : ''}
                                                    />
                                                    {errors.sellerEmail && (
                                                        <span className="form-error">{errors.sellerEmail.message}</span>
                                                    )}
                                                </div>
                                            </div>

                                            <div>
                                                <h3></h3>
                                                <label>Seller Company<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                                <div>
                                                    <Image className={styles.input_icon} src="/edit-icon.svg" width={24} height={24} alt="usdc" />
                                                    <input type="text" placeholder="Global Export Limited"
                                                        {...register('sellerCompany', {
                                                            required: 'Enter seller company',
                                                        })}
                                                        className={errors.sellerCompany ? styles.error : ''}
                                                    />
                                                    {errors.sellerCompany && (
                                                        <span className="form-error">{errors.sellerCompany.message}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={styles.form_input}>
                                        <div>
                                            <h3>Trade Details</h3>
                                            <label>Goods Description<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                            <div>
                                                <Image className={styles.input_icon} src="/edit-icon.svg" width={24} height={24} alt="usdc" />
                                                <input type="text" placeholder="Describe the goods being traded"
                                                    {...register('description', {
                                                        required: 'Enter goods description',
                                                    })}
                                                    className={errors.description ? styles.error : ''}
                                                />
                                                {errors.description && (
                                                    <span className="form-error">{errors.description.message}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className={styles.form_input}>
                                        <div>
                                            <h3></h3>
                                            <label>Document Type<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                            <div>
                                                <select
                                                    {...register('docType', {
                                                        required: 'document type is required'
                                                    })}
                                                    className={errors.docType ? styles.error : ''}
                                                >
                                                    <option value="">Document type</option>
                                                    <option value="billOfLading">Bill of lading</option>
                                                    <option value="airWaybill">Air waybill</option>
                                                    <option value="roadConsignment">Road Consignment</option>
                                                </select>
                                                {errors.docType && (
                                                    <span className="form-error">{errors.docType.message}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>


                                    <div className={styles.form_input}>
                                        <div>
                                            {/* <h3>Trade Details</h3> */}
                                            <label>Shipping Deadline<Image src="/information-tooltip.svg" width={12} height={12} alt="input" /></label>
                                            <div>
                                                <Image className={styles.input_icon} src="/calendar-icon.svg" width={24} height={24} alt="usdc" />
                                                <input type="date" placeholder="Pick a deadline"
                                                    {...register('deadline', {
                                                        required: 'Enter shipping deadline',
                                                        validate: (value) => {
                                                            const selectedDate = new Date(value);
                                                            const today = new Date();
                                                            today.setHours(0, 0, 0, 0);
                                                            return selectedDate >= today || 'Deadline must be in the future';
                                                        }
                                                    })}
                                                    className={errors.deadline ? styles.error : ''} />
                                            </div>
                                        </div>


                                    </div>
                                    <div style={{ marginTop: '20px' }}>
                                        <button disabled={loading} onClick={handleSubmit(createLC)} className={styles.create_lc_button}>
                                            {loading ? <div className='loader'></div> : "Create LC"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeStep === 2 && data && (
                            <FundLC fundLc={fundLC} data={data} activeStep={activeStep} setActiveStep={setActiveStep} />
                        )}

                        {activeStep === 3 && data && (
                            <div className={styles.create__summary}>
                                <div className={styles.create__summary__alert}>
                                    <Image className={styles.input_icon} src="/success-mark.svg" width={20} height={20} alt="usdc" />
                                    <div>
                                        <h4>LC Successfully Funded!</h4>
                                        <p>Your Letter of Credit {data.lcId} has been created and funded with ${data.amount} USDC</p>
                                    </div>
                                </div>

                                <div className={styles.line}></div>

                                <div className={styles.main}>
                                    <div className={styles.main__header}>
                                        <Image className={styles.input_icon} src="/mail-line.svg" width={20} height={20} alt="usdc" />
                                        <h4>Send Invitation to Seller</h4>
                                    </div>

                                    <div className={styles.main__info}>
                                        <p>What happens when you send the invitation?</p>
                                    </div>


                                    <div className={styles.main__list}>
                                        <div>
                                            <Image className={styles.input_icon} src="/invitation.svg" width={28} height={28} alt="usdc" />
                                            <p>Invitation email sent to {data.sellerEmail}</p>
                                        </div>
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
                                                <h3>Amount:</h3>
                                                <p>${data.amount}</p>
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
                                                <p>$00.80</p>
                                            </div>
                                            <div>
                                                <h3>Total Required:</h3>
                                                <p style={{ fontWeight: 700 }}>${data.amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div className={styles.buttons}>
                                    <Link href={'/dashboard/lc-management'}>
                                        <button className={styles.back}>
                                            <Image src="/arrow-left.svg" width={20} height={20} alt="continue" />
                                            Back to LC Details
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateLC
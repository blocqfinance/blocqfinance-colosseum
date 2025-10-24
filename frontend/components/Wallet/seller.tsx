import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './wallet.module.scss'
import Image from 'next/image';
import { ReactSVG } from 'react-svg';
import { useToast } from '../toast/ToastContext';
import { updateSellerLc } from '@/libs/api/collections/seller';
import CONTRACT_ABI from '../../app/utils/LetterOfCredit.json'

interface WalletProps {
    blocqId: string | undefined
    id: string | undefined
    close: () => void
}

interface ContractInfo {
    funded?: boolean;
    released?: boolean;
    refunded?: boolean;
    amount?: string;
    deadline?: Date;
    buyer?: string;
    seller?: string;
    admin?: string;
}

interface EthereumProvider {
    request: (args: { method: string }) => Promise<unknown>;
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isPhantom?: boolean;
    providers?: EthereumProvider[];
}

interface WindowWithEthereum extends Window {
    ethereum?: EthereumProvider;
    phantom?: {
        ethereum?: EthereumProvider;
    };
}

declare const window: WindowWithEthereum;

const Wallet: React.FC<WalletProps> = ({ id, blocqId, close }: WalletProps) => {
    const [step, setStep] = useState(1);
    const [walletAddress, setWalletAddress] = useState('');
    const [isConnecting, setIsConnecting] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
    const [error, setError] = useState('');
    const [contractInfo, setContractInfo] = useState<ContractInfo>({});
    const { showToast } = useToast()

    const CONTRACT_ADDRESS = "0x3c6Fa322551607a547A1DA8f09DFd3F664F386Bf"

   
    const connectWallet = async (walletType: string) => {
       
    };

    const registerSeller = async () => {
       
    };

    const formatAddress = (address: string) => {
        if (!address) return '';
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const disconnectWallet = () => {
        setSigner(null);
        setWalletAddress('');
        setContractInfo({});
        setStep(1);
    };

    const updateLc = async () => {
        if (!id) {
            console.error('No LC ID provided');
            return;
        }
        const data = {
            "trigger": "sellerRegistered",
            "sellerWalletAddress": walletAddress,
            "termsAcceptedBySeller": true
        }
        console.log(data);
        try {
            const response = await updateSellerLc(id, data);
            if (response.statusCode === 201 || response.statusCode === 200) {
                console.log(response);
                showToast('success', 'Seller registration completed');
            } else {
                console.log(response);
            }
        } catch (error) {
            console.error('Error updating LC:', error);
        }
    }

    // Check if seller is already registered
    const isSellerRegistered = contractInfo.seller && contractInfo.seller !== '0x0000000000000000000000000000000000000000';

    return (
        <div className={styles.connect}>
            <div className={styles.header}>
                <div>
                    <ReactSVG src="/wallet.svg"/>
                    <div>
                        <h4>Register as Seller</h4>
                        <p>
                        Connect your wallet to register as seller for this LC
                        </p>
                    </div>
                </div>

                <Image
                    width={30}
                    height={40}
                    className={styles.img2}
                    src="/close-icon-black.svg"
                    alt=""
                    onClick={close}
                />
            </div>

            {error && (
                <div style={{ color: 'red', padding: '10px', textAlign: 'center', fontSize: '14px' }}>
                    {error}
                </div>
            )}

           {step === 1 && <div className={styles.inner}>
                <div className={styles.options} onClick={() => connectWallet('metamask')}>
                    <div>
                        <Image src="/meta.svg" width={36} height={36} alt="metamask wallet" />
                        <div>
                            <h4>MetaMask</h4>
                            <p>{isConnecting ? 'Connecting...' : 'Connect using MetaMask wallet'}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.options} onClick={() => connectWallet('coinbase')}>
                    <div>
                        <Image src="/coinbase.svg" width={36} height={36} alt="coinbase wallet" />
                        <div>
                            <h4>Coinbase</h4>
                            <p>{isConnecting ? 'Connecting...' : 'Connect using Coinbase wallet'}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.options} onClick={() => connectWallet('walletconnect')}>
                    <div>
                        <Image src="/wallet-connect.svg" width={36} height={36} alt="wallet connect" />
                        <div>
                            <h4>Wallet Connect</h4>
                            <p>{isConnecting ? 'Connecting...' : 'Scan with Wallet-connect to connect'}</p>
                        </div>
                    </div>
                </div>
                <div className={styles.options} onClick={() => connectWallet('phantom')}>
                     <div>
                        <Image src="/phantom.svg" width={36} height={36} alt="phantom wallet" />
                        <div>
                            <h4>Phantom</h4>
                            <p>{isConnecting ? 'Connecting...' : 'Connect with Phantom wallet'}</p>
                        </div>
                    </div>
                </div>
            </div>}

            {step === 2 && <div className={styles.inner}>
                <div className={styles.inner__wallet}>
                    <ReactSVG src="/success-mark.svg"/>
                    <div>
                      <h5>Wallet Connected</h5>
                      <p>{formatAddress(walletAddress)}</p>
                    </div>
                    <button 
                        onClick={disconnectWallet}
                        className={styles.disconnect}
                    >
                        Disconnect
                    </button>
                </div>

                {/* Contract Status Info */}
                {/* {contractInfo.seller !== undefined && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '14px' }}>
                        <h6 style={{ margin: '0 0 10px 0' }}>LC Status:</h6>
                        <p style={{ margin: '5px 0' }}>
                            Seller: {isSellerRegistered ? `✅ ${formatAddress(contractInfo.seller)}` : '❌ Not registered'}
                        </p>
                        <p style={{ margin: '5px 0' }}>Funded: {contractInfo.funded ? '✅ Yes' : '❌ No'}</p>
                        <p style={{ margin: '5px 0' }}>Released: {contractInfo.released ? '✅ Yes' : '❌ No'}</p>
                        <p style={{ margin: '5px 0' }}>Refunded: {contractInfo.refunded ? '✅ Yes' : '❌ No'}</p>
                    </div>
                )} */}

            </div>}

            {step === 2 && <div className={styles.footer}>
                <button className={styles.back} onClick={() => setStep(1)}>
                    Cancel
                </button>
                <button 
                   className={styles.continue}
                    onClick={registerSeller}
                    style={{ 
                        opacity: (isRegistering || isSellerRegistered) ? 0.6 : 1 
                    }}
                >
                    {isRegistering ? 'Registering...' : isSellerRegistered ? 'Already Registered' : 'Register as Seller'}
                </button>
            </div> }
        </div>
    )
}

export default Wallet
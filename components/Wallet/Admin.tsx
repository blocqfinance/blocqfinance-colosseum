import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './wallet.module.scss'
import Image from 'next/image';
import { ReactSVG } from 'react-svg';
import { useToast } from '../toast/ToastContext';
import CONTRACT_ABI from '../../app/utils/LetterOfCredit.json'
import { updateFundRelease } from '@/libs/api/collections/lc';

interface WalletProps {
    id: string | undefined
    blocqId: string | undefined
    paramId: string | null
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

const Wallet: React.FC<WalletProps> = ({ blocqId, paramId }: WalletProps) => {
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
        setIsConnecting(true);
        setError('');

        try {
            let provider: ethers.BrowserProvider;
            let ethereum: EthereumProvider | undefined;

            switch (walletType) {
                case 'metamask':
                    if (typeof window.ethereum === 'undefined') {
                        throw new Error('MetaMask not found. Please install MetaMask extension.');
                    }

                    if (window.ethereum.providers) {
                        ethereum = window.ethereum.providers.find((p: EthereumProvider) => p.isMetaMask);
                        if (!ethereum) {
                            throw new Error('MetaMask not found among installed wallets.');
                        }
                    } else if (window.ethereum.isMetaMask) {
                        ethereum = window.ethereum;
                    } else {
                        throw new Error('MetaMask not detected. Please install MetaMask extension.');
                    }

                    await ethereum.request({ method: 'eth_requestAccounts' });
                    provider = new ethers.BrowserProvider(ethereum);
                    break;

                case 'coinbase':
                    if (typeof window.ethereum === 'undefined') {
                        throw new Error('Coinbase Wallet not found. Please install Coinbase Wallet extension.');
                    }

                    if (window.ethereum.providers) {
                        ethereum = window.ethereum.providers.find((p: EthereumProvider) => p.isCoinbaseWallet);
                        if (!ethereum) {
                            throw new Error('Coinbase Wallet not found among installed wallets.');
                        }
                    } else if (window.ethereum.isCoinbaseWallet) {
                        ethereum = window.ethereum;
                    } else {
                        throw new Error('Coinbase Wallet not detected. Please install Coinbase Wallet extension.');
                    }

                    await ethereum.request({ method: 'eth_requestAccounts' });
                    provider = new ethers.BrowserProvider(ethereum);
                    break;

                case 'walletconnect':
                    throw new Error('WalletConnect integration requires additional setup. Please use MetaMask, Coinbase, or Phantom for now.');

                case 'phantom':
                    if (window.phantom?.ethereum) {
                        ethereum = window.phantom.ethereum;
                        await ethereum.request({ method: 'eth_requestAccounts' });
                        provider = new ethers.BrowserProvider(ethereum);
                    } else if (window.ethereum?.isPhantom) {
                        ethereum = window.ethereum;
                        await ethereum.request({ method: 'eth_requestAccounts' });
                        provider = new ethers.BrowserProvider(ethereum);
                    } else if (window.ethereum?.providers) {
                        ethereum = window.ethereum.providers.find((p: EthereumProvider) => p.isPhantom);
                        if (!ethereum) {
                            throw new Error('Phantom wallet not found among installed wallets.');
                        }
                        await ethereum.request({ method: 'eth_requestAccounts' });
                        provider = new ethers.BrowserProvider(ethereum);
                    } else {
                        throw new Error('Phantom wallet not found. Please install Phantom wallet extension.');
                    }
                    break;

                default:
                    throw new Error('Unsupported wallet type');
            }

            const signer = await provider.getSigner();
            const address = await signer.getAddress();

            setSigner(signer);
            setWalletAddress(address);
            setStep(2);
            
            console.log(`Connected to ${walletType} wallet:`, address);
            
        } catch (error) {
            const err = error as Error;
            console.error(`Error connecting ${walletType} wallet:`, err);
            setError(err.message || `Failed to connect ${walletType} wallet`);
        } finally {
            setIsConnecting(false);
        }
    };

    const sendFunds = async () => {
        if (!signer) {
            setError('Wallet not connected');
            return;
        }
    
        if (!CONTRACT_ADDRESS) {
            setError('Contract address not provided');
            return;
        }
    
        if (!blocqId) {
            setError('LC ID not provided');
            return;
        }
    
        setIsRegistering(true);
        setError('');
    
        try {
            console.log('Releasing funds for LC:', blocqId);
            
            const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI.abi, signer);
            
            // Check LC status
            const lc = await contract.lcs(blocqId);
            console.log('LC Status:');
            console.log('- Funded:', lc.funded);
            console.log('- Released:', lc.released);
            console.log('- Seller:', lc.seller);
            console.log('- Amount:', ethers.formatUnits(lc.amount, 6));
            
            if (!lc.funded) {
                throw new Error('LC is not funded yet');
            }
            
            if (lc.released) {
                throw new Error('LC has already been released');
            }
            
            if (lc.seller === '0x0000000000000000000000000000000000000000') {
                throw new Error('Seller has not registered yet');
            }
            
            // Skip gas estimation, send with manual gas limit
            console.log('Sending release transaction with manual gas limit...');
            const releaseTx = await contract.release(blocqId, {
                gasLimit: 300000, // Increased gas limit
                maxFeePerGas: ethers.parseUnits('2', 'gwei'),
                maxPriorityFeePerGas: ethers.parseUnits('1', 'gwei')
            });
            
            console.log('Transaction sent:', releaseTx.hash);
            showToast('info', 'Transaction submitted, waiting for confirmation...');
            
            const receipt = await releaseTx.wait();
            console.log('Transaction confirmed:', receipt);

            await updateLc();
            
            if (receipt.status === 1) {
                showToast('success', 'Funds released successfully!');
            } else {
                throw new Error('Transaction failed');
            }
            
        } catch (error) {
            const err = error as Error & { reason?: string };
            console.error('Error releasing funds:', err);
            
            if (err.message.includes('LC is not funded')) {
                setError('LC must be funded before releasing');
            } else if (err.message.includes('already been released')) {
                setError('Funds have already been released');
            } else if (err.message.includes('Seller has not registered')) {
                setError('Seller must register before funds can be released');
            } else if (err.reason) {
                setError(`Transaction failed: ${err.reason}`);
            } else if (err.message.includes('user rejected')) {
                setError('Transaction rejected by user');
            } else if (err.message.includes('insufficient funds')) {
                setError('Insufficient ETH for gas fees');
            } else {
                setError(err.message || 'Failed to release funds');
            }
        } finally {
            setIsRegistering(false);
        }
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
        if (!paramId) {
            console.error('No LC ID provided');
            return;
        }

        const data = {
            "trigger": "releaseFund"
        }

        console.log(data);
        try {
            const response = await updateFundRelease(paramId, data);
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
                        style={{ 
                            background: 'none', 
                            border: '1px solid #ccc', 
                            padding: '5px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Disconnect
                    </button>
                </div>

                {/* Contract Status Info */}
                {contractInfo.seller !== undefined && (
                    <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px', fontSize: '14px' }}>
                        <h6 style={{ margin: '0 0 10px 0' }}>LC Status:</h6>
                        <p style={{ margin: '5px 0' }}>
                            Seller: {isSellerRegistered ? `✅ ${formatAddress(contractInfo.seller)}` : '❌ Not registered'}
                        </p>
                        <p style={{ margin: '5px 0' }}>Funded: {contractInfo.funded ? '✅ Yes' : '❌ No'}</p>
                        <p style={{ margin: '5px 0' }}>Released: {contractInfo.released ? '✅ Yes' : '❌ No'}</p>
                        <p style={{ margin: '5px 0' }}>Refunded: {contractInfo.refunded ? '✅ Yes' : '❌ No'}</p>
                    </div>
                )}
            </div>}

            {step === 2 && <div className={styles.footer}>
                <button className={styles.btn1} onClick={() => setStep(1)}>
                    Cancel
                </button>
                <button 
                    className={styles.btn2} 
                    onClick={sendFunds}
                    style={{ 
                        opacity: (isRegistering || isSellerRegistered) ? 0.6 : 1 
                    }}
                >
                    {isRegistering ? 'Registering...' : isSellerRegistered ? 'Already Registered' : 'Released'}
                </button>
            </div> }
        </div>
    )
}

export default Wallet
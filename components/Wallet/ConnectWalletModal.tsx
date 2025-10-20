import React, { useState } from 'react';
import { ethers } from 'ethers';
import styles from './wallet.module.scss';
import Image from 'next/image';
import { ReactSVG } from 'react-svg';

interface WalletProps {
    setProvider: (provider: ethers.BrowserProvider | null) => void;
    setWalletAddress: (address: string) => void;
    setSigner: (signer: ethers.JsonRpcSigner | null) => void;
    setIsConnected: (isConnected: boolean) => void;
    setShowModal: (show: boolean) => void;
    CONTRACT_ADDRESS?: string;
    fundAmount?: string;
    id?: string;
}

interface EthereumProvider {
    request: (args: { method: string }) => Promise<unknown>;
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
    isPhantom?: boolean;
}

interface WindowWithEthereum extends Window {
    ethereum?: EthereumProvider & {
        providers?: EthereumProvider[];
    };
    phantom?: {
        ethereum?: EthereumProvider;
    };
}

declare const window: WindowWithEthereum;

const Wallet: React.FC<WalletProps> = ({ 
    setProvider, 
    setWalletAddress, 
    setSigner, 
    setIsConnected,  
    setShowModal
}) => {
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

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

            setProvider(provider);
            setSigner(signer);
            setWalletAddress(address);
            setIsConnected(true);
            setShowModal(false);

        } catch (error) {
            const err = error as Error;
            console.error(`Error connecting ${walletType} wallet:`, err);
            setError(err.message || `Failed to connect ${walletType} wallet`);
        } finally {
            setIsConnecting(false);
        }
    };

    return (
        <div className={styles.connect}>
            <div className={styles.header}>
                <div>
                    <ReactSVG src="/wallet.svg"/>
                    <div>
                        <h4>Fund Letter of Credit</h4>
                        <p>
                            Connect your wallet to fund this LC with USDC
                        </p>
                    </div>
                </div>

                <Image
                    width={30}
                    height={40}
                    className={styles.img2}
                    src="/close-icon-black.svg"
                    alt=""
                    onClick={() => setShowModal(false)}
                />
            </div>

            {error && (
                <div style={{ color: 'red', padding: '10px', textAlign: 'center', fontSize: '14px' }}>
                    {error}
                </div>
            )}

            <div className={styles.inner}>
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
            </div>
        </div>
    );
};

export default Wallet;
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
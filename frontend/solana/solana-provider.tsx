import { WalletError } from '@solana/wallet-adapter-base'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import React, { useCallback, useMemo } from 'react'
import '@solana/wallet-adapter-react-ui/styles.css'
export { WalletMultiButton as WalletButton }

export function SolanaProvider({ children }: { children: React.ReactNode }) {

    const cluster = {
        "name": "devnet",
        "endpoint": "https://api.devnet.solana.com",
        "network": "devnet",
        "active": true
    }
    const endpoint = useMemo(() => cluster.endpoint, [cluster])
    const onError = useCallback((error: WalletError) => {
        console.error(error)
    }, [])

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={[]} onError={onError} autoConnect={true}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    )
}

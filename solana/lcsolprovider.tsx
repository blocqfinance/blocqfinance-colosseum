"use client";

import React, { createContext, useContext } from "react";
import { ClusterProvider } from "./cluster-data-access";
import { SolanaProvider } from "./solana-provider";

interface LCSPParams {
    children: React.ReactNode;
}

interface SolProviderProps {
    name: string
}

const SolProvider = createContext<SolProviderProps | undefined>(undefined);

export const useSolProvider = () => {
    const data = useContext(SolProvider);
    return data;
};

const LCSolProvider = ({ children }: LCSPParams) => {
    const name = "dd"
    return (
        <SolProvider.Provider value={{ name }}>
            <ClusterProvider>
                <SolanaProvider>
                    {children}
                </SolanaProvider>
            </ClusterProvider>
        </SolProvider.Provider>
    )
};

export default LCSolProvider;
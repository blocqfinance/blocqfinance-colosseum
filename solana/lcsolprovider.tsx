"use client";

import React, { createContext, useContext } from "react";
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
            <SolanaProvider>
                {children}
            </SolanaProvider>
        </SolProvider.Provider>
    )
};

export default LCSolProvider;
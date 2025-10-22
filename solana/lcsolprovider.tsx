"use client";

import React, { createContext, useContext } from "react";
import { SolanaProvider } from "./solana-provider";
import LCAnchorContext from "./anchor-provider";

interface LCSPParams {
    children: React.ReactNode;
}

interface SolProviderProps {

}

const SolProvider = createContext<SolProviderProps | undefined>(undefined);

export const useSolProvider = () => {
    const data = useContext(SolProvider);
    return data;
};

const LCSolProvider = ({ children }: LCSPParams) => {

    return (
        <SolProvider.Provider value={{}}>
            <SolanaProvider>
                <LCAnchorContext>
                    {children}
                </LCAnchorContext>
            </SolanaProvider>
        </SolProvider.Provider>
    );
};

export default LCSolProvider;
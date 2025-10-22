
import { createContext, useContext } from "react";
import { AnchorProvider, Program } from "@coral-xyz/anchor";
import { AnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react'
import LetterOfCreditIdl from "./letter_of_credit.json";
import type { LetterOfCredit } from "./letter_of_credit";

export interface LCAnchorContext {
    program: Program<LetterOfCredit> | undefined;
    provider: AnchorProvider | undefined;
}
export const LCAnchorContext = createContext<LCAnchorContext | undefined>(undefined);

export const useLCAnchorContext = () => {
    return useContext(LCAnchorContext);
}
const LCAnchorProvider = ({ children }: { children: React.ReactNode }) => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const provider = new AnchorProvider(connection, wallet as AnchorWallet, { commitment: 'confirmed' })

    const program = new Program<LetterOfCredit>(LetterOfCreditIdl as LetterOfCredit, provider);

    return (
        <LCAnchorContext.Provider value={{ program, provider }}>
            {children}
        </LCAnchorContext.Provider>
    );
};

export default LCAnchorProvider;
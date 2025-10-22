import BN from "bn.js";
import * as web3 from "@solana/web3.js";
import type { LCAnchorContext } from "./anchor-provider";


import type { LcFormData } from "../components/create-lc/CreateLC";

// deconstructs the anchor context
const deconstructAC = (anchorContext: LCAnchorContext) => {
    const { program, provider } = anchorContext;
    const publicKey = provider?.publicKey;
    return { program, publicKey };
}

const getUsdcMint = () => {
    const usdcMintAddress = process.env.NEXT_PUBLIC_USDC_MINT;
    if (!usdcMintAddress) return false;
    const usdcMint = new web3.PublicKey(usdcMintAddress);
    return usdcMint;
}

// create an LC
export const createLCCall = async (formData: LcFormData, lcAnchorContext: LCAnchorContext): Promise<number> => {
    if (!lcAnchorContext?.program || !lcAnchorContext.program) return 0;
    console.log("creating lc");
    const { program, publicKey } = deconstructAC(lcAnchorContext);
    console.log("Verifying program validity");
    if (!program || !publicKey) return 0;
    console.log("Proceeding")
    const [globalCounterPDA] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("global_state")],
        program?.programId
    );

    const globalState = await program.account.globalState.fetch(globalCounterPDA);
    const id = globalState.lcCounter.toString();
    const date = new Date(formData?.deadline).getTime();
    console.log("Creating lc with id ", id);

    try {
        console.log("Anchor program entered");
        await program.methods
            .createLc(new BN(Number(formData.amount)), new BN(date / 1000))
            .accounts({ buyer: publicKey })
            .rpc();
        console.log("LC Created on chain");
        return Number(id);
    } catch (err: any) {
        const errStr = err.toString();
        if (errStr.includes("already been processed")) return Number(id);
        console.error(errStr);
        alert("Failed to create LC");
        return 0;
    }

};

export const fundLCCall = async (blocqId: number, lcAnchorContext: LCAnchorContext): Promise<boolean> => {
    const { program, publicKey } = deconstructAC(lcAnchorContext);
    if (!program || !publicKey) return false;

    const [letterCredit] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from('lc'), publicKey.toBuffer(), new BN(blocqId).toArrayLike(Buffer, "le", 8)],
        program.programId
    );
    console.log("Letter credit:", letterCredit?.toString());
    const mint = getUsdcMint();
    if (!mint) return false;

    try {
        await lcAnchorContext.program?.methods.fund().accounts({
            buyer: publicKey, letterCredit, mint
        }).rpc();
        return true;
    } catch (err: any) {
        const errAsStr = err.toString();
        if (errAsStr.includes("already been processed")) {
            return true;
        }
        console.log(errAsStr);
        return false;
    }
}

// register new seller
export const registerSellerCall = async (lcAnchorContext: LCAnchorContext, buyerAddress: string | undefined, blocqId: string | undefined)
    : Promise<boolean> => {
    console.log("trigered");
    const { program, publicKey } = deconstructAC(lcAnchorContext);
    console.log(program, publicKey)
    console.log(buyerAddress);
    if (!program || !publicKey || !blocqId || !buyerAddress) return false;
    const seller = publicKey
    // derive PDA from values
    const [letterCredit] = web3.PublicKey.findProgramAddressSync(
        [Buffer.from("lc"), new web3.PublicKey(buyerAddress).toBuffer(), new BN(Number(blocqId)).toArrayLike(Buffer, "le", 8)],
        program?.programId
    );
    // make block chain call
    try {
        await program.methods.registerSeller().accounts({
            letterCredit, seller
        }).rpc();
        return true;
    } catch (err: any) {
        // if failure, check if transaction was repeated and already processed.
        const errAsStr = err.toString();
        if (errAsStr.includes("already been processed")) {
            return true;
        }
        // else alert err
        console.log(errAsStr);
        return false;
    }
}

export const refundCall = async (lcAnchorContext: LCAnchorContext): Promise<boolean> => {

    const { program, publicKey } = deconstructAC(lcAnchorContext);
    if (!program || !publicKey) return false;
    const letterCredit = new web3.PublicKey("");

    const mint = getUsdcMint();
    if (!mint) return false;
    const sender = publicKey;
    try {
        await program.methods.refund().accounts({
            letterCredit, mint, sender
        }).rpc();
        return true;
    } catch (err: any) {
        const errAsStr = err.toString();
        if (errAsStr.includes("already been processed")) {
            return true;
        }
        console.log(errAsStr);
        return false;
    };
};

export const releaseCall =
    async (lcAnchorContext: LCAnchorContext, blocId: string | undefined, buyerAddress: string | undefined, sellerAddress: string | undefined)
        : Promise<boolean> => {
        const { program, publicKey } = deconstructAC(lcAnchorContext);
            console.log(sellerAddress, buyerAddress);
        if (!program || !publicKey || !buyerAddress || !sellerAddress) return false;
        const admin = publicKey;
        const mint = getUsdcMint();
        const seller = new web3.PublicKey(sellerAddress);
        if (!mint) return false;
        const [letterCredit] = web3.PublicKey.findProgramAddressSync(
            [Buffer.from("lc"), new web3.PublicKey(buyerAddress).toBuffer(),
            new BN(Number(blocId)).toArrayLike(Buffer, "le", 8)],
            program?.programId
        )
        try {
            await program.methods.release().accounts({
                admin, letterCredit, mint, seller
            }).rpc();
            return true;
        } catch (err: any) {
            const errAsStr = err.toString();
            if (errAsStr.includes("already been processed")) {
                return true;
            }
            console.log(errAsStr);
            return false;
        };
    }
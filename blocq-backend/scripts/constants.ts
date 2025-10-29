import dotenv from 'dotenv';

const isDevelopment = process.env.ENV === 'development';
console.log(isDevelopment);

if (isDevelopment) {
    // Load env files locally
    dotenv.config({ path: '.env.local' });
}

export const config = {
    PORT: process.env.PORT || 4321,
    MONGO_URI: process.env.MONGO_URI as string,
};

// const now = Math.floor(Date.now() / 1000); // seconds
// const deadline = now + 60 * 60 * 24 * 7; // 7 days from now

export const CONSTANTS = {
    adminAddress: process.env.ADMIN_ADDRESS as string,
    usdcAddress: process.env.USDC_ADDRESS as string,
    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL as string,
    privateKey: process.env.PRIVATE_KEY as string,
    etherscanApiKey: process.env.ETHERSCAN_API_KEY as string,
    etherscanApiUrl: process.env.ETHERSCAN_API_URL as string,
    etherscanChainId: process.env.ETHERSCAN_CHAIN_ID as string,
};

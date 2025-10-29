import dotenv from 'dotenv';

const isDevelopment = process.env.ENV === 'development';
console.log(isDevelopment);

if (isDevelopment) {
    dotenv.config({ path: '.env.local' });
} else {
    dotenv.config({ path: '.env' });
}

export const config = {
    PORT: process.env.PORT || 4321,
    DB_NAME: process.env.DB_NAME as string,
    MONGO_URI: process.env.MONGO_URI as string,
    privateKey: process.env.PRIVATE_KEY as string,
    sepoliaRpcUrl: process.env.SEPOLIA_RPC_URL as string,
};

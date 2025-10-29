import { createClient } from 'redis';

const client = createClient({
    username: process.env.REDIS_USERNAME as string,
    password: process.env.REDIS_PASSWORD as string,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT as unknown as number,
        keepAlive: true,
    },
});

const connectToRedis = async () => {
    try {
        console.log('Connecting to Redis...');
        await client.connect();
    } catch (err) {
        console.error('Failed to connect to Redis:', err);
    }
};

client.on('error', (err) => console.error('Redis Client Error', err));
client.on('connect', () => console.info('Connected to Redis!!!'));
client.on('reconnecting', () => console.info('Reconnecting to Redis...'));

export { connectToRedis, client };

import { config } from '../src/config/index';
import dbConnect from '../src/services/db.service';
import { connectToRedis } from '../src/services/redis.service';
import app from '../app';

const { MONGO_URI, PORT, DB_NAME } = config;

app.listen(PORT, () => {
    console.info(`App 🚀running on Port http://localhost:${PORT}`);
    dbConnect(MONGO_URI, DB_NAME);
    connectToRedis();
});

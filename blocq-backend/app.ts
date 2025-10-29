import express, { type Request, type Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './src/routes/index';
import {
    rateLimiter,
    errorHandler,
    unknownEndpoints,
} from './src/middlewares/index';

const app = express();

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'Access-Control-Allow-Credentials',
    ],
    credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use(rateLimiter);

app.get('/', (req: Request, res: Response) => {
    res.json({ msg: 'welcome to BlocqFinance' });
});

app.use('/api/v1', router);
app.use(unknownEndpoints);
app.use(errorHandler);

export default app;

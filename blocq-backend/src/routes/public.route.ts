import express from 'express';
const publicRouter = express.Router();
import { getLC } from '../controllers/letterOfCredit.controller';

publicRouter.get('/lc/:lcId', getLC);

export default publicRouter;

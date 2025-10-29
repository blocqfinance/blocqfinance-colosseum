import { type Request, type Response } from 'express';

export const unknownEndpoints = (req: Request, res: Response) => {
    return res
        .status(404)
        .json({ err: 'Right location, wrong route', statuscode: -1 });
};

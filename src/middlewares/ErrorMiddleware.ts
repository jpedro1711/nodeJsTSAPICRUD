import { Request, Response, NextFunction } from "express";
import {AppException} from "../Exceptions/AppException";


export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    if (err instanceof AppException) {
        return res.status(err.status).json({ error: err.message, success: false });
    }

    return res.status(500).json({ error: "Internal Server Error", success: false });
}
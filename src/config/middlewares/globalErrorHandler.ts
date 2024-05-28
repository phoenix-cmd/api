import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config";

const globalErrorHandler=(
    err:HttpError,
    req:Request,
    res:Response,
    next:NextFunction
) => {
// global error handler 
    const statusCode=err.statusCode || 500;
    return res.status(statusCode).json({
    message: err.message,
    errorStack:config.env=="development"? err.stack:""
    });
};
export default globalErrorHandler;
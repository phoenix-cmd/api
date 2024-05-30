import express, { NextFunction, Request, Response } from "express";
import createHttpError, { HttpError } from "http-errors";
import { config } from "./config/config";
import globalErrorHandler from "./config/middlewares/globalErrorHandler";
import userRouter from "./users/userRouter";
import { createBook } from "./book/bookController";
import bookRouter from "./book/bookRouter";
const app = express();
app.use(express.json());

// Routes
//http methods GET,POST,PUT,PATCH,DELETE
app.get("/", (req, res, next) => {
  res.json({ message: "Hello World" });
});

// global error handler
app.use("/api/users", userRouter);
app.use('/api/Books',bookRouter);
app.use(globalErrorHandler);

export default app;

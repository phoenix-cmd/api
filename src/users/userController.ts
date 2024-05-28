
import { NextFunction, Request, Response, request } from "express";
import createHttpError from "http-errors";
import userModal from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { access } from "fs";

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  //! validation
  if (!name || !email || !password) {
    const error = createHttpError(400, "All field are required");
    return next(error);
  }
  //! database call.
  const user = await userModal.findOne({
    email: email,
  });

  if (user) {
    const error = createHttpError(400, "User already exit with this email");
    return next(error);
  }

  //! password
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await userModal.create({
    name,
    email,
    password: hashedPassword,
  });
  //! process
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
  });

  //! response
  res.json({
    accessToken: token,
  });
};

export { createUser };
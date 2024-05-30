
import { NextFunction, Request, Response, request } from "express";
import createHttpError from "http-errors";
import userModal from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import { User } from "./userTypes";

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

  try {
    if (user) {
      const error = createHttpError(400, "User already exit with this email");
      return next(error);
    }
  }
  catch(err){
    return next(createHttpError(500,"Error while getting the user"));
  }

  

  //! password
  const hashedPassword = await bcrypt.hash(password, 10);
  
  let newUser : User;
  try{
    newUser = await userModal.create({
      name,
      email,
      password: hashedPassword,
    });
  }
  catch(err){
    return next(createHttpError(500,'Error while Creating the user'));
  }

  try{
  //! token genrated jwt
  const token = sign({ sub: newUser._id }, config.jwtSecret as string, {
    expiresIn: "7d",
    algorithm:'HS256',
  });

  //! response
  res.json({
    accessToken: token,
  });
}catch(err){
  return next(createHttpError(500,"Error  while signing the jwt token"));
}
};

export { createUser };
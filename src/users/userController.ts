
import { NextFunction, Request, Response, request } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
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
  const user = await userModel.findOne({
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
    newUser = await userModel.create({
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
  res.status(201).json({
    accessToken: token,
  });
}catch(err){
  return next(createHttpError(500,"Error  while signing the jwt token"));
}
};
const loginUser =async (req:Request,res:Response,next:NextFunction)=>{
const{email,password}= req.body;
if(!email  || !password){
return next(createHttpError(400,"all fields are required"));
}

const user = await userModel.findOne({email});
if (!user){
  return next (createHttpError(404,"User not found"));
}
const isMatch= await bcrypt.compare(password,user.password);

if (!isMatch){
  return next(createHttpError(401,"Invalid credentials"));
}
//create new access token
const token = sign({ sub:user._id }, config.jwtSecret as string, {
  expiresIn: "7d",
  algorithm:'HS256',
});
res.json({accessToken:token})
}
export { createUser,loginUser };
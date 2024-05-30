
import { Request,Response,NextFunction } from "express";
const createBook= async(

    req: Request, res: Response, next:NextFunction

)=>{
//const{}= req.body;
console.log('files',req.files);
res.json({});


};
export {createBook};
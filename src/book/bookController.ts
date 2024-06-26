
import { Request,Response,NextFunction } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import bookModel from "./bookModel";
import fs from "node:fs"
const createBook= async(

    req: Request, res: Response, next:NextFunction

)=>{
const{title,genre}= req.body;
console.log('files',req.files);
const files= req.files as {[fieldname:string]:Express.Multer.File[]};
// application/pdf
const coverImageMimeType=files.coverImage [0].mimetype.split("/").at(-1);
const fileName= files.coverImage[0].filename;
const filePath=path.resolve(__dirname,'../../public/data/uploads',fileName);
const uploadResult = await cloudinary.uploader.upload(filePath,{
   filename_override: fileName,
   folder:'book-covers',
format: coverImageMimeType,
});
const bookFileName = files.file[0].filename;
const bookFilePath= path.resolve(__dirname,
    "../../public/data/uploads",
bookFileName
    );
const bookFileUploadResult = await cloudinary.uploader.upload(bookFilePath,{
    resource_type:'raw',
filename_override:bookFileName,
    folder:'book-pdfs',
    format:"pdf",
});
console.log('bookFileUploadResult',bookFileUploadResult);


console.log('uploadResult',uploadResult);
const newBook = await bookModel.create({
    title,
    genre,
    author:"66549ec2fc6fe94074be6c5c",
    coverImage:uploadResult.secure_url,
    file:bookFileUploadResult.secure_url,

});
// delete temp files
await fs.promises.unlink(filePath);
await fs.promises.unlink(bookFilePath);
res.status(201).json({id:newBook._id});
res.json({});


};
export {createBook};
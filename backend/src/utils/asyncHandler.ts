import type { NextFunction, Request, RequestHandler, Response } from "express";

const asyncHandler = (requestHandler:RequestHandler)=>{
    return (req:Request,res:Response,next:NextFunction) =>{
        Promise
        .resolve()
        .then(()=>requestHandler(req,res,next))
        .catch(next);
    }
}

export default asyncHandler;
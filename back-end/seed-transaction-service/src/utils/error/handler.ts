import { Request, Response, NextFunction } from 'express';
import {
   AuthorizeError,
   NotFoundError,
   ValidationError,
} from './errors';
import { logger } from '../logger';

export const HandleErrorWithLogger = (
   error: Error,
   req: Request,
   res: Response,
   next: NextFunction
 ) => {
   let reportError = true;
   let status = 500;
   let data = { message: error.message };
 
   // Handle known error types
   [NotFoundError, ValidationError, AuthorizeError].forEach((typeOfError) => {
     if (error instanceof typeOfError) {
       reportError = false;
       status = (error as any).status || 400; 
       data = { message: error.message };
     }
   });
 
   if (reportError) {
     logger.error(error); 
   } else {
     logger.warn(error); 
   }
 
   res.status(status).json(data);
 };

export const HandleUnCaughtException = async (
   error: Error,
) => {
   // error report / monitoring tools
   logger.error(error);
   // recover
   process.exit(1);
};

import { Multer } from 'multer';
import type { UserDocument } from '../models/user.model.ts';

declare global {
    namespace Express {
        interface Request {
            file?: Multer.File;
            files?: {
                [fieldname: string]: Multer.File[];
            } | Multer.File[];
            user?:UserDocument | null |any;
        }
    }
}
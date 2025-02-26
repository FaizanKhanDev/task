import multer, { FileFilterCallback } from 'multer';
import path from 'path';
import { Request } from 'express';
import { fileURLToPath } from 'url';

// Set up storage configuration
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
        let uploadPath = '';
        /* =========== Get base directory of the projec ========== */
        let baseDir = path.resolve(__dirname, '../');

        /* =========== Set upload path =========== */
        uploadPath = path.join(baseDir, 'public/uploads/files/');

        /* =========== Return path =========== */
        cb(null, uploadPath);
    },
    filename: (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

let limits = {
    fileSize: 10 * 1024 * 1024
};

const upload = multer({ storage: storage, limits: limits });
export default upload;

import express, { Router, Request, Response } from 'express';
import AuthController from '../../../controllers/auth';
const router: Router = express.Router();



/* ====== User Register ====== */
router.post('/register', AuthController.register);

/* ============ Login =============== */
router.post('/login', AuthController.login);


/* ====== Verified Email ======= */
router.post('/verified-email', AuthController.verifiedEmail);

export { router as AuthRoutes };

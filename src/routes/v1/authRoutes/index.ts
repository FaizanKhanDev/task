import express, { Router, Request, Response } from 'express';
import AuthController from '../../../controllers/auth';
import { authentification } from '../../../middlewares/auth.authentification';
const router: Router = express.Router();


router.use('/on-auth-state-change', authentification)


/* ====== User Register ====== */
router.post('/register', AuthController.register);

/* ============ Login =============== */
router.post('/login', AuthController.login);


/* ====== Verified Email ======= */
router.post('/verified-email', AuthController.verifiedEmail);
router.post('/on-auth-state-change', AuthController.onAuthStateChange);

export { router as AuthRoutes };

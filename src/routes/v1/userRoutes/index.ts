import express, { Router, Request, Response } from 'express';
import UserController from '../../../controllers/user';
const router: Router = express.Router();

import { authentification } from '../../../middlewares/auth.authentification';

/* ====== Get User Details ====== */
router.use(authentification)

/* ====== Subscribe New Profile ====== */
router.put('/subscribe-new-profile', UserController.subscribeNewProfileTypeByUser);
router.all('/subscribe-new-profile', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});


/* ====== Change Role ====== */
router.put('/switch-user-type', UserController.changeRole);
router.all('/switch-user-type', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
}
);
/* ====== Change Role ====== */
router.put('/update-profile', UserController.updateProfile);
router.all('/update-profile', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
}
);
/* ====== Change Password ====== */
router.put('/change-password', UserController.changePassword);
router.all('/change-password', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});
/* ====== forget Password ====== */
router.put('/forget-password', UserController.forgetPassword);
router.all('/forget-profile', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});
/* ====== verify  otp  ====== */
router.put('/verify-otp', UserController.verifyOtp);
router.all('/verify-otp', (req, res) => {
    if (req.method !== 'PUT') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});


/* ====== GET LIST OF ALL USERS ====== */
router.get('/get-users-list', UserController.getAllUsers);
router.all('/get-users-list', (req, res) => {
    if (req.method !== 'GET') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});
/* ====== GET LIST OF ALL USERS ====== */
router.post('/set-user-location', UserController.setUserLocation);
router.all('/set-user-location', (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).send({
            "status": "failed",
            "message": "Method Not Allowed",
            "data": null
        })
    }
});

export { router as UserRoutes };

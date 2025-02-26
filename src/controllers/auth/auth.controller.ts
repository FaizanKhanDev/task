import { Request, Response } from "express";
import { Encrypt } from "../../helpers"
import * as cache from "memory-cache";
import { errorHandler } from "../../middlewares/error.middleware";
import { prisma } from "../../prismaClient"
import AuthService from "../../modules/auth/auth.service";
import AuthRepository from "../../modules/auth/auth.repository";
import { AuthRequest } from "../../interfaces";
import emailExistence from 'email-existence'
import validator from 'validator';

class AuthController {
    /* ============= User Register ======= */
    public static async register(req: Request, res: Response) {
        try {
            let { fullName, email, password, role } = req.body;


            let requiredField = []
            if (!fullName) requiredField.push("fullName");
            if (!email) requiredField.push("email");
            if (!password) requiredField.push("password");

            if (requiredField.length > 0) {
                return res.status(400).json({ status: "error", message: "All fields are required", data: requiredField });
            }
            const isEmailValid = validator.isEmail(req.body.email);
            if (!isEmailValid) {
                return res.status(400).json({ status: "error", message: "Invalid email address", data: [] });
            }

            // let emailExist = await emailExistence.check(email, async (error, response) => {
            // if (response) {
            /* ==== FInd User bY Email Address ==== */
            let findUser = await AuthRepository.findByEmail(email);
            if (findUser) {
                return res.status(400).json({ message: "Email is already registered" });
            }
            /* === User === */
            let user = await AuthService.createUser(email, password, fullName, role);
            if (!user) {
                return res.status(500).json({ message: "Failed to create user" });
            }
            return res.status(201).json({
                status: "success",
                message: "Verifcation Process is successfully Completed",
                data: []
            });
            // } else {
            // return res.status(400).json({ status: "error", message: "Email is not registered", data: [] });
            // }
            // });

        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    /* ================ Login =============== */
    public static async login(req: Request, res: Response) {
        try {
            let { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    status: "error",
                    message: "All fields are required",
                    data: []
                });
            }
            let user = await AuthService.login(email, password);
            if (user.status == 404) {
                return res.status(404).json({ message: "User not found" });
            }
            const token = AuthService.generateToken(user);
            let responsePayload = {
                ...user,
                token: token,
            }
            return res.status(200).json({ data: responsePayload, status: "success", message: "Login successfully" });
        }
        catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }

    /* ======= Verified Email ======= */
    public static async verifiedEmail(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            if (!email) {
                return res.status(400).json({ status: "error", message: "Email is required" });
            }
            let user = await AuthService.verifyEmail(email, otp);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const token = AuthService.generateToken(user);

            let responsePayload = {
                ...user,
                userToken: token,
            }
            return res.status(200).json({ data: responsePayload, status: "success", message: "Email verified successfully" });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }







}

export default AuthController
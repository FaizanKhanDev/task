import { Request, Response } from "express";
import { Encrypt } from "../../helpers"
import * as cache from "memory-cache";
import { errorHandler } from "../../middlewares/error.middleware";
import { prisma } from "../../prismaClient"
import AuthService from "../../modules/auth/authService";
import AuthRepository from "../../modules/auth/authRepository";
import UserModel from "../../models/userModel"
import { AuthRequest } from "../../types/interfaces";
import UserServices from "../../modules/user/userService";
import emailExistence from 'email-existence'
import validator from 'validator';

class AuthController {
    /* ============= User Register ======= */
    public static async register(req: Request, res: Response) {
        try {
            let { fullName, email, coverImage, password, userType, profilePic, deviceToken } = req.body;
            let url = profilePic;
            let role = userType;
            let requiredField = []
            if (!fullName) requiredField.push("fullName");
            if (!email) requiredField.push("email");
            if (!password) requiredField.push("password");
            if (!deviceToken) requiredField.push("deviceToken");

            if (requiredField.length > 0) {
                return res.status(400).json({ status: "error", message: "All fields are required", data: requiredField });
            }
            // const isEmailValid = validator.isEmail(req.body.email);
            // if (!isEmailValid) {
            //     return res.status(400).json({ status: "error", message: "Invalid email address", data: [] });
            // }

            // let emailExist = await emailExistence.check(email, async (error, response) => {
            // if (response) {
            /* ==== FInd User bY Email Address ==== */
            let findUser = await AuthRepository.findByEmail(email);
            if (findUser) {
                return res.status(400).json({ message: "Email is already registered" });
            }
            /* === User === */
            let user = await AuthService.createUser(email, password, fullName, role, url, deviceToken, coverImage);
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

    /* ========== Generate Unique Name ############### NOT IN USE ######################### ======== */
    // private static async generateUniqueUsername(name: string, email: string): Promise<string> {
    //     const baseUsername = name.toLowerCase().replace(/\s+/g, '');
    //     let username = baseUsername;
    //     let suffix = 1;

    //     /* =========== Check if username exists =========== */
    //     const existingUsernames = await prisma.user.findMany({
    //         where: {
    //             username: {
    //                 startsWith: baseUsername
    //             }
    //         },
    //         select: {
    //             username: true
    //         }
    //     });

    //     /* ======= SET USER UNIQUE NAME ======== */
    //     const usernameSet = new Set(existingUsernames.map(user => user.username));
    //     while (usernameSet.has(username)) {
    //         suffix++;
    //         username = `${baseUsername}${suffix.toString().padStart(2, '0')}`;
    //     }
    //     return username;
    // }

    /* ================ Login =============== */
    public static async login(req: Request, res: Response) {
        try {
            const { email, password, isAdminPanel = false } = req.body;
            if (!email || !password) {
                return res.status(400).json({ status: "Failed", message: "All fields are required" });
            }
            // const isEmail = email.includes('@');
            const isEmail = true

            const user = await AuthService.login(email, password, isEmail);
            if (!user) {
                return res.status(401).json({ message: "Invalid email or password" });
            }
            if (user.status == 404) {
                return res.status(404).json({ message: "User Not Found", data: [], status: "failed" });
            }
            const token = await AuthService.generateToken(user);

            let response = new UserModel(user);
            let payload = {
                user: "",
                token: "",
            }
            if (isAdminPanel) {
                payload.user = user;
                payload.token = token;
                return res.status(200).send({
                    status: "success",
                    message: "User logged in successfully",
                    data: payload
                });
            }
            return res.status(200).send({
                status: "success",
                message: "User logged in successfully",
                data: {
                    ...response,
                    userToken: token,
                    user: user
                }
            });
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

            let response = new UserModel(user);
            let responsePayload = {
                ...response,
                userToken: token,
            }
            return res.status(200).json({ data: responsePayload, status: "success", message: "Email verified successfully" });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    public static async onAuthStateChange(req: AuthRequest, res: Response) {
        try {
            let response = await UserServices.getUserByIdService(req.user);
            return res.status(200).send({
                status: "sucess",
                message: "on Auth State Change Sucessfully",
                data: {
                    response
                }

            })
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }




}

export default AuthController
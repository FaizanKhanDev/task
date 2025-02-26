import { prisma } from "@/prismaClient"
import { Encrypt, OTPGenerator } from "../../helpers";
import AuthRepository from "./auth.repository";
import bcrypt from 'bcrypt'
import transporter from "../../config/email/nodemailerConfiguration";
import { Role } from "@prisma/client";
import EmailService from "../../services/email";
class AuthService {

    /* ============ Create User =========== */
    public static async createUser
        (
            email: string,
            password: string,
            fullName: string,
            role: Role,

        ): Promise<any> {
        try {
            /* -----    Hash Password     ----- */
            let hashedPassword = await Encrypt.encryptpass(password);



            /* --- generate OTP ----* */
            let otp = OTPGenerator.generateOTP();


            /* -----    Create User     ----- */
            const newUser = await AuthRepository.createUser(email, hashedPassword, fullName, role, otp);
            if (!newUser || !newUser.verification) {
                return null;
            }

            /* NOTE CURRENTLY I HAVEN'T ANY EMAIL AND IT'S APPLESS PASSWORD FOR EMAIL SENDIND -----*/
            console.log("newUser.verification.resetOtp", newUser.verification.resetOtp);

            return newUser;
            /* NOTE CURRENTLY I HAVEN'T ANY EMAIL AND IT'S APPLESS PASSWORD FOR EMAIL SENDIND -----*/
            /* ================ Verification Email Configuration  ================ */
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Email Verification',
                /* ================ Email Template ================ */
                html: "",
            });

        } catch (error: any) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }


    /* ========== Login ========= */
    public static async login(email: string, password: string): Promise<any> {
        try {
            /* ========== Find User ========= */

            let findUserPromise = await
                AuthRepository.findByEmail(email)


            const user = findUserPromise;
            if (!user || !user.verification) {
                return {
                    success: false,
                    message: "User not found",
                    user: null,
                    status: 404
                }
            }
            if (user) {
                const isPasswordValid = await Encrypt.comparepassword(password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }
            }
            // /* ====== Check is User Verified ====== */
            if (user.verification && user.verification.isEmailVerified != "VERIFIED") {

                /* --- need to sent OTP EMAIL ----*/
                let otp = OTPGenerator.generateOTP();
                let setNewOtp = AuthRepository.setNewOtp(user.id, otp);
                throw new Error("Email is not verified");
            }

            /* ========== Compare Password ========= */

            return user;
        } catch (error: any) {
            throw new Error(`Failed to login: ${error.message}`);
        }
    }


    /* ========= generate token ========= */
    public static generateToken(user: any) {
        const token = Encrypt.generateToken(user);
        return token;
    }

    /* ========= Verify Email ========= */
    public static async verifyEmail(email: string, otp: number) {
        try {
            const user = await AuthRepository.findByEmail(email);
            if (!user) {
                throw new Error("User not found");
            }

            if (user.verification) {
                if (user.verification.resetOtpExpiresAt && user.verification.resetOtpExpiresAt < new Date()) {
                    throw new Error("OTP expired");
                }
                if (user.verification.isEmailVerified == "VERIFIED") {
                    throw new Error("Email already verified");
                }

                if (user.verification.resetOtp != otp) {
                    throw new Error("Invalid OTP");
                }
            }
            const updatedUser = await AuthRepository.verfiedTheUser(user.id);
            return user;
        } catch (error: any) {
            throw new Error(`Failed to verify email: ${error.message}`);
        }
    }




}


export default AuthService
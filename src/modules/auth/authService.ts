import { prisma } from "@/prismaClient"
import { Encrypt, OTPGenerator } from "../../helpers";
import AuthRepository from "../../modules/auth/authRepository";
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
            url: string | null,
            deviceToken: string,
            coverImage: string | null,


        ): Promise<any> {
        try {
            /* -----    Hash Password     ----- */
            let hashedPassword = await Encrypt.encryptpass(password);

            /* -----    Create User     ----- */
            const newUser = await AuthRepository.createUser(email, hashedPassword, fullName, role, url, deviceToken, coverImage);
            if (!newUser || !newUser.verification) {
                return null;
            }
            console.log("newUser.verification.resetOtp", newUser.verification.resetOtp)
            /* ================ Verification Email Configuration  ================ */
            let info = await transporter.sendMail({
                from: process.env.EMAIL_FROM,
                to: email,
                subject: 'Email Verification',
                /* ================ Email Template ================ */
                html: `
                    <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Pupify App</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${fullName} </p>
                    <p>Thank you for Joining Pupify App. Use the following OTP to complete your Sign Up procedures. OTP is valid for 15 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${newUser.verification.resetOtp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Pupify App</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Pupify App</p>
                    </div>
                    </div>
                </div>
             `,
            });

            return newUser;
        } catch (error: any) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }


    /* ========== Login ========= */
    public static async login(identifier: string, password: string, isEmail: boolean): Promise<any> {
        try {
            /* ========== Find User ========= */

            let findUserPromise = await
                AuthRepository.findByEmail(identifier)


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
                let generateOTP = await OTPGenerator.generateOTP();
                let setOtp = await AuthRepository.setNewOtp(user.id, generateOTP);
                if (!setOtp) {
                    throw new Error(" Failed to send OTP ")
                }
                const html = `
                    <div style="font-family: Helvetica, Arial, sans-serif; min-width: 1000px; overflow: auto; line-height: 1.6;">
                        <div style="margin: 50px auto; width: 70%; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
                            <div style="border-bottom: 2px solid #00466a; padding-bottom: 10px; margin-bottom: 20px;">
                                <a href="" style="font-size: 1.6em; color: #00466a; text-decoration: none; font-weight: bold;">Pupify App</a>
                            </div>
                            <p style="font-size: 1.2em; margin-bottom: 20px;">Dear ${user.fullName},</p>
                            <p style="font-size: 1.1em; margin-bottom: 20px;">Thank you for your interest in logging into Pupify App. To proceed, please verify your email address by using the OTP (One-Time Password) provided below. This step is necessary to complete your login process.</p>
                            <h2 style="background: #00466a; color: #fff; padding: 15px; border-radius: 4px; text-align: center; font-size: 1.5em; margin: 0;">
                                ${generateOTP}
                            </h2>
                            <p style="font-size: 1em; margin-top: 20px;">Please note that this OTP is valid for 15 minutes. If you did not attempt to log in, you may disregard this email.</p>
                            <p style="font-size: 1em; margin-top: 20px;">If you have any questions or need further assistance, feel free to contact our support team.</p>
                            <p style="font-size: 1em; margin-top: 20px;">Best regards,<br />The Pupify Team</p>
                            <hr style="border: none; border-top: 1px solid #ddd; margin-top: 20px;" />
                            <div style="float: right; padding: 8px 0; color: #aaa; font-size: 0.9em;">
                                <p>Pupify App</p>
                            </div>
                        </div>
                    </div>
                `;

                console.log("generateOTP", JSON.stringify(generateOTP))


                /* ----- SET OPTION FOR EMAIL SENDING -----*/
                // let options = {
                //     to: identifier,
                //     subject: "Account Verfication Email",
                //     html: html,
                // }
                // let sendOTPEmail = await EmailService.sendEmail(options)
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
        let payload = {
            id: user.id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            deviceToken: user.deviceToken
        }
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
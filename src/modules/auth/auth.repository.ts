import { prisma } from "../../prismaClient";

import { Role } from "@prisma/client";
export default class AuthRepository {

    /* ========== Create User ========= */
    public static async createUser(
        email: string,
        password: string,
        fullName: string,
        role: Role,
        otp: number,
    ) {
        try {

            console.log("otp", otp);

            const newUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    fullName,
                    role,
                    verification: {
                        create: {
                            resetOtp: otp,
                            resetOtpExpiresAt: new Date(Date.now() + 3600000)
                        }
                    },
                },
                include: {
                    verification: true,
                }
            });

            return newUser;
        } catch (error: any) {
            throw new Error(`Failed to create user: ${error.message}`);
        }
    }




    /* ========== Find User ========= */
    public static async findByEmail(email: string) {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                },
                include: {
                    verification: true,
                }
            });
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            throw new Error(`Failed to find user: ${error.message}`);
        }
    }





    /* ========== Update User ========= */
    public static async verfiedTheUser(id: number) {
        try {
            const user = await prisma.userVerification.update({
                where: {
                    userId: id,
                },
                data: {
                    isEmailVerified: "VERIFIED"
                },
            });
            if (!user) {
                return null;
            }
            return user;
        } catch (error: any) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }




    /* ========== GET USER BY ID ========= */
    public static async getUserById(id: number) {
        try {

            const user = await prisma.user.findUnique({
                where: {
                    id
                },
                include: {
                    verification: true,
                }
            });
            if (!user) {
                return null;
            }
            return user;

        } catch (error) {
            throw new Error(`Failed to get user: ${error}`);
        }
    }



    /* ===== SET NEW OTP SETUP ===== */
    public static async setNewOtp(id: number, resetOtp: number) {
        try {
            const user = await prisma.userVerification.update({
                where: {
                    userId: id,
                },
                data: {
                    resetOtp: resetOtp,
                    resetOtpExpiresAt: new Date(Date.now() + 3600000)
                },
            });
            if (!user) {
                return null;
            }
            return user;
        }
        catch (error: any) {
            throw new Error(`Failed to set new OTP: ${error}`);
        }
    }

}

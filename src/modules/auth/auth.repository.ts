import { prisma } from "../../prismaClient";

import { Role } from "@prisma/client";
export default class AuthRepository {

    /* ========== Create User ========= */
    public static async createUser(
        email: string,
        password: string,
        fullName: string,
        role: Role,
        url: string | null,
        deviceToken: string,
        coverImage: any,
    ) {
        try {
            let findProfileType = await prisma.profileType.findFirst({
                where: {
                    subscriptionType: "STANDARD",
                }
            });
            /* === FInd Profile Type === */
            if (!findProfileType) {
                throw new Error("Default profile type 'STANDARD' not found or is not marked as default.");
            }

            let resetOtp = Math.floor(100000 + Math.random() * 900000);
            const newUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    fullName,
                    role,
                    url: url,
                    coverImage: coverImage,
                    deviceToken,
                    verification: {
                        create: {
                            resetOtp: resetOtp,
                            resetOtpExpiresAt: new Date(Date.now() + 3600000)
                        }
                    },
                    ...(role != "ADMIN" && {
                        userProfile: {
                            create: {
                                postImagesLimit: findProfileType.postImagesLimit,
                                postAboutTextLimit: findProfileType.postAboutTextLimit,
                                freeAdAfterLimit: findProfileType.freeAdAfterLimit,
                                subscriptionPrice: findProfileType.subscriptionPrice,
                                listingCost: findProfileType.listingCost,
                                adCost: findProfileType.adCost,
                                hasFreeAdd: findProfileType.hasFreeAdd,
                                hasVideo: findProfileType.hasVideo,
                                hasSocialMediaLinks: findProfileType.hasSocialMediaLinks,
                                totalAdsCount: 0,
                                adsCountAfterLastSubscription: 0,
                                subscriptionDate: new Date(),
                                expiryDate: new Date(Date.now() + 3600000),
                                createdAt: new Date(),
                                updatedAt: new Date(),
                            }
                        }
                    })
                },
                include: {
                    verification: true,
                    location: true,
                    userProfile: true
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
                    location: true,
                    userProfile: true
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


    /* ========= Find User By Username ======== */
    // public static async findByUsername(identifier: string) {
    //     try {
    //         const user = await prisma.user.findUnique({
    //             where: {
    //                 username: identifier
    //             },
    //             include: {
    //                 verification: true,
    //                 location: true
    //             }
    //         });
    //         if (!user) {
    //             return null;
    //         }
    //         return user;

    //     } catch (error) {
    //         console.log("Failed to find user: ", error);
    //     }
    // }


    /* ========== GET USER BY ID ========= */
    public static async getUserById(id: number) {
        try {

            const user = await prisma.user.findUnique({
                where: {
                    id
                },
                include: {
                    verification: true,
                    location: true,
                    userProfile: true
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

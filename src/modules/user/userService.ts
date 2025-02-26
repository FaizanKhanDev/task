import { Role } from "@prisma/client";
import ProfileTypeRepository from "../profile_types/profileTypeRepository";
import { UserRepository } from "./userRepository";
import { AuthRequest } from "../../types/interfaces";
import AuthRepository from "../auth/authRepository";
import UserModel from "../../models/userModel";
import AuthService from "../auth/authService";
import { OTPGenerator } from "../../helpers"
import { Encrypt } from "../../helpers";
import EmailService from "../../services/email";
import AdvertisementsRepository from "../advertisements/advertisementsRepository";
import AdvertisementsModels from "../../models/advertisementModel";
import { arrangedListingsAdvertisements, reorderListings } from "../../helpers";
class UserServices {

    /* =========== update User Profile Type ========*/
    public static async updateUserProfileTypeService(user: number, profileTypeId: number) {
        try {
            let findProfileType = await ProfileTypeRepository.getProfileTypeByIdRepo(profileTypeId);
            let result = await UserRepository.updateUserProfileTypeRepo(user, profileTypeId, findProfileType);
            let findUser = await AuthRepository.getUserById(user);
            const token = AuthService.generateToken(findUser);
            if (!findUser) {
                return null;
            }
            let response = new UserModel(findUser);
            let responsePayload = {
                ...response,
                userToken: token,
            }
            return responsePayload

        } catch (error: any) {
            throw new Error(`Failed to update user: ${error}`);
        }
    }


    /* ===== Change Roles ===== */
    public static async changeRoleService(user: any, role: Role) {
        try {
            let result = await UserRepository.changeRoleRepo(user, role)
            const token = AuthService.generateToken(result);
            if (!result) {
                return null;
            }
            let response = new UserModel(result);
            let responsePayload = {
                ...response,
                userToken: token,
            }
            return responsePayload
        } catch (error: any) {
            throw new Error(`Failed to change role: ${error.message}`);
        }
    }


    /* ====== Update Profile ====== */
    public static async updateProfileService(user: any, data: any) {
        try {
            let result = await UserRepository.updateUserProfileRepo(user, data)
            const token = AuthService.generateToken(result);
            let response = new UserModel(result);
            let responsePayload = {
                ...response,
                userToken: token,
            }
            return responsePayload
        } catch (error: any) {
            throw new Error(`Failed to update user: ${error.message}`);
        }
    }


    /* ===== Change Password =====*/
    public static async changePasswordService(user: any, currentPassword: string, newPassword: string) {
        try {
            let findUser = await AuthRepository.getUserById(user.id);
            if (!findUser) {
                throw new Error("User not found");

            }
            let comparePassword = await Encrypt.comparepassword(currentPassword, findUser.password);
            if (!comparePassword) {
                throw new Error("Invalid current password");
            }
            let encryptpass = await Encrypt.encryptpass(newPassword);
            let result = await UserRepository.changePasswordRepo(user, encryptpass)
            if (!result) {
                return false;
            }
            return true
        } catch (error: any) {
            throw new Error(`Failed to change password: ${error.message}`);
        }
    }

    public static async forgetPasswordService(email: string) {
        try {
            let findUser = await AuthRepository.findByEmail(email);
            if (!findUser) {
                throw new Error("User not found");
            }
            const generateOTP = await OTPGenerator.generateOTP();
            let setOtp = await AuthRepository.setNewOtp(findUser.id, generateOTP);
            if (!setOtp) {
                throw new Error(" Failed to send OTP ")
            }
            let html = `  <div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
                    <div style="margin:50px auto;width:70%;padding:20px 0">
                    <div style="border-bottom:1px solid #eee">
                        <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">Classified App</a>
                    </div>
                    <p style="font-size:1.1em">Hi, ${findUser.fullName} </p>
                    <p>Thank you for Joining Classified App. Use the following OTP to complete your Sign Up procedures. OTP is valid for 15 minutes</p>
                    <h2 style="background: #00466a;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${setOtp.resetOtp}</h2>
                    <p style="font-size:0.9em;">Regards,<br />Classified App</p>
                    <hr style="border:none;border-top:1px solid #eee" />
                    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
                        <p>Classified App</p>
                    </div>
                    </div>
                </div>`
            let options = {
                to: findUser.email,
                subject: 'Forget Password Email',
            }

            let sendEmail = EmailService.sendEmail(options);
            if (!sendEmail) {
                throw new Error("Failed to send email")
            }

            return true
        } catch (error: any) {
            throw new Error(`Failed to forgot password: ${error.message}`);
        }
    }

    /* ==== Verify OTP ====*/
    public static async verifyOtpService(email: string, otp: number) {
        try {
            let user = await AuthRepository.findByEmail(email);
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
            const token = AuthService.generateToken(user);
            let response = new UserModel(user);
            let responsePayload = {
                ...response,
                userToken: token,
            }
            return responsePayload
        } catch (error: any) {
            throw new Error(`Failed to verify OTP: ${error.message}`);
        }
    }


    /* ==== GET ALL USERS LIST ====*/
    public static async getUsersListService(page: number, limit: number, search: string, profileType: any, role: Role) {
        try {
            let result = await UserRepository.getUsersListRepo(page, limit, search, profileType, role);
            return result
        } catch (error: any) {
            console.log("error", error)
            throw new Error(`Failed to get users list: ${error.message}`);
        }
    }

    /* ====== set Location ====*/
    public static async setUserLocationService(user: any, payload: any) {
        try {
            let result = await UserRepository.setUserLocationRepo(user, payload)
            let response = new UserModel(result);
            const token = AuthService.generateToken(result);

            let responsePayload = {
                ...response,
                userToken: token,
            }
            return responsePayload
        } catch (error: any) {
            console.log("error", error)
            throw new Error(`Failed to get users list: ${error.message}`);
        }
    }

    /* ----- GET ALLL STORE LIST ____*/
    public static async getAllStoresListService(user: any) {
        try {
            console.log("user", user.id)
            // Define the number of stores to return
            const pageSize = 10;

            /* ---- GET ALL STORES ---*/
            let allStores = await UserRepository.getAllStoresListRepo({
                where: {
                    role: {
                        notIn: ["ADMIN"]
                    },
                    id: {
                        notIn: [user.id],
                    }
                },
                include: {
                    sentConnections: {
                        where: {
                            receiverId: user.id
                        }
                    },
                    receivedConnections: {
                        where: {
                            senderId: user.id
                        }
                    }
                },
                take: 1000,
            });

            // Check if there are enough stores
            if (allStores.length < pageSize) {
                throw new Error('Not enough stores available.');
            }

            const getRandomItems = (arr: any[], num: number) => {
                const shuffled = arr.slice(0);
                let i = arr.length, temp, index;

                while (i-- > 0) {
                    index = Math.floor(Math.random() * (i + 1));
                    temp = shuffled[index];
                    shuffled[index] = shuffled[i];
                    shuffled[i] = temp;
                }

                return shuffled.slice(0, num);
            };

            // Randomly select 10 stores
            let result = getRandomItems(allStores, pageSize);

            // Get the seller IDs for the reviews count
            let getSellerIds = result.map((item: any) => item.id);
            let findUserTotalReviewCount = await UserRepository.getUserReviewsCount(getSellerIds);

            // Map review counts to sellers
            const reviewCountMap = new Map(
                findUserTotalReviewCount.map((item) => [item.sellerId, item.reviewCount])
            );

            result.forEach((item: any) => {
                if (reviewCountMap.has(item.id)) {
                    item.reviews = reviewCountMap.get(item.id);
                } else {
                    item.reviews = 0;
                }
            });
            let response = result.map((item: any) => {
                let connection = [];
                let isSender = false
                if (item.receivedConnections.length > 0) {
                    connection = item.receivedConnections;

                    isSender = true
                } else if (item.sentConnections.length > 0) {
                    connection = item.sentConnections
                    isSender = false
                }
                return {
                    sellerId: item.id,
                    fullName: item.fullName,
                    profilePic: item.url,
                    coverImage: item.coverImage,
                    ratings: item.averageRating,
                    reviews: item.reviews,
                    connection: connection.length > 0
                        ? {
                            id: connection[0].id,
                            senderId: connection[0].senderId,
                            receiverId: connection[0].receiverId,
                            // senderId: isSender ? connection[0].receiverId : connection[0].senderId,
                            status: connection[0].isAccepted ? "CONNECTED" : "REQUESTED",
                        }
                        : null

                };
            }).filter(item => item !== null);
            // Format the response
            // let response = result.map((item: any) => {
            //     return {
            //         sellerId: item.sentConnections?.id == user.id ? item.receivedConnections?.id : item.sender?.id,
            //         fullName: item.sentConnections?.id == user.id ? item.receivedConnections?.fullName : item.sender?.fullName,
            //         profilePic: item.sentConnections?.id == user.id ? item.receivedConnections?.url : item.sender?.url,
            //         coverImage: item.sentConnections?.id == user.id ? item.receivedConnections?.coverImage : item.sender?.coverImage,
            //         ratings: 0,
            //         reviews: 0,
            //         connection: {
            //             id: item.id,
            //             senderId: item.sentConnections?.id,
            //             status: item.sentConnections.isAccepted ? "CONNECTED" : "REQUESTED",
            //         }
            //         // id: item.id,
            //         // profilePic: item.url,
            //         // fullName: item.fullName,
            //         // coverImage: item.coverImage,
            //         // ratings: item.averageRating,
            //         // reviews: item.reviews,
            //         // connectionId: item.sentConnections?.length > 0 ? item.sentConnections[0].id : null,
            //         // connectionSenderId: item.sentConnections?.length > 0 ? item.sentConnections[0].senderId : null,
            //         // connectionStatus: item.sentConnections?.length > 0 ? item.sentConnections[0].isAccepted ? "CONNECTED" : "REQUESTED" : null,

            //     };
            // });

            return response;
        } catch (error: any) {
            console.log(error);
            throw new Error(`Failed to get Stores list: ${error.message}`);
        }
    }




    /* ------ GET STORE LISTINGS BY SELLER ID ----*/
    public static async getStoreListingsBySellerIdRepo(sellerId: any, page: number = 1) {
        try {
            let findManyOptionsAdvertisements: any = {
                where: {
                    user: {
                        id: {
                            in: [sellerId]
                        }
                    },
                    advertisements: {
                        isExpired: false,
                        expiredOn: {
                            gt: new Date(),
                        },
                    }
                },
                take: 4,
                skip: (page - 1) * 4,
                include: {
                    images: true,
                    video: true,
                    user: true,
                    location: true,
                    metrics: true,
                    advertisements: {
                        include: {
                            customization: true,
                        }
                    },
                    _count: {
                        select: {
                            wishList: true,
                        },
                    },
                }
            }
            let findManyOptionsListings: any = {
                where: {
                    user: {
                        id: {
                            in: [sellerId]
                        }
                    },
                    advertisements: null
                },
                take: 16,
                skip: (page - 1) * 16,
                include: {
                    images: true,
                    video: true,
                    user: true,
                    location: true,
                    metrics: true,
                    advertisements: {
                        include: {
                            customization: true,
                        }
                    },
                },
            }

            let result = await AdvertisementsRepository.getRecentListingsAndAdvertisementsRepo(findManyOptionsListings,
                findManyOptionsAdvertisements);


            /* --------- Arrange Listings and Advertisements --------- */
            let resultListings = result[1].map((item: any) => new AdvertisementsModels(item))
            let resultModel = result[0].map((item: any) => new AdvertisementsModels(item))

            /*  --------- Arrange Listings and Advertisements --------- */
            let arrangedListingsAdvertisement = arrangedListingsAdvertisements(
                resultListings,
                resultModel
            );

            let newResponse = reorderListings(arrangedListingsAdvertisement)
            return newResponse;


        } catch (error: any) {
            console.log(error)
            throw new Error(`Failed to get Stores list: ${error.message}`);

        }
    }


    /* --------- GET USER BY ID -------------*/
    public static async getUserByIdService(user: any) {
        try {
            let getUserById = await AuthRepository.getUserById(user.id)
            let generateToken = await AuthService.generateToken(getUserById)
            if (!getUserById) {
                return null;
            }
            let response = new UserModel(getUserById);
            let responsePayload = {
                ...response,
                userToken: generateToken,
            }
            return responsePayload
        } catch (error: any) {
            console.log("error", error)
            throw new Error(`Failed to get User : ${error.message}`);

        }
    }

}
export default UserServices
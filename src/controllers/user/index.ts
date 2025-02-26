import { Request, Response, Router } from 'express';
import { errorHandler } from '../../middlewares/error.middleware';
import { SetDataTypes } from '../../helpers';
import UserServices from '../../modules/user/userService';
import { AuthRequest } from '../../types/interfaces';
import { Role } from '@prisma/client';

class UserController {
    public static async getAllUsers(req: AuthRequest, res: Response) {
        try {
            let { page = 1, limit = 10, search = '', profileType = 'STANDARD', role = '' } = req.query
            let pageInt = SetDataTypes.parseInt(page);
            let limitInt = SetDataTypes.parseInt(limit);


            let result = await UserServices.getUsersListService(pageInt, limitInt, search as string, profileType, role as Role)
            if (!result) {
                return res.status(404).send({
                    status: "failed",
                    message: "Users not found",
                    data: [],
                })
            }

            return res.status(200).send({
                status: "success",
                message: "Users found successfully",
                data: {
                    users: result.result,
                    totalCount: result.totalCount
                }
            })


        } catch (error) {
            errorHandler(error as Error, req, res)
        }
    }

    /* =========== update User Profile Type ========*/
    public static subscribeNewProfileTypeByUser = async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.query;
            if (!req.user) {
                return res.status(401).json({ status: "error", message: "Unauthorized", data: [] });
            }
            if (!id) {
                return res.status(400).send({
                    status: "failed",
                    message: "Profile Type is required",
                    data: [],
                })
            }

            let profileTypeId = SetDataTypes.parseInt(id);
            let userId = SetDataTypes.parseInt(req.user.id);
            const result = await UserServices.updateUserProfileTypeService(userId, profileTypeId);
            if (result) {
                return res.status(200).json({ status: "success", message: "Profile type updated successfully", data: result });
            }

            return res.status(500).json({ status: "failed", message: "Profile type updating Failed", data: [] });

        } catch (error) {
            errorHandler(error as Error, req, res)
        }
    }

    /* ================ Change Role ===================*/
    public static async changeRole(req: AuthRequest, res: Response) {
        try {
            const { userType } = req.body;
            let role = userType
            if (!userType) {
                return res.status(401).json({ status: "error", message: "Couldn't findout the Role", data: [] });
            }

            if (userType == "ADMIN" || userType == "admin") {
                return res.status(403).json({ status: "error", message: "Invalid Role", data: [] });
            }

            const user = await UserServices.changeRoleService(req.user, role);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ message: "User role updated successfully", data: user });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    /* ======= Update Profile =================*/
    public static async updateProfile(req: AuthRequest, res: Response) {
        try {
            const { fullName, profilePic, phoneNumber } = req.body;
            if (!fullName) {
                return res.status(400).json({ status: "error", message: "All fields are required", data: [] });
            }
            const user = await UserServices.updateProfileService(req.user, req.body);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ status: "success", message: "User profile updated successfully", data: user });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    /* ===== Change Password ===== */
    public static async changePassword(req: AuthRequest, res: Response) {
        try {
            const { currentPassword, newPassword } = req.body;
            if (!currentPassword || !newPassword) {
                return res.status(400).json({ status: "error", message: "All fields are required", data: [] });
            }
            const user = await UserServices.changePasswordService(req.user, currentPassword, newPassword);
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json({ status: "success", message: "User password updated successfully", data: user });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }



    /* ====== Forget Password ===== */
    public static async forgetPassword(req: Request, res: Response) {
        try {
            const { email } = req.body;
            if (!email) {
                return res.status(400).json({ status: "error", message: "Email is required", data: [] });
            }
            const user = await UserServices.forgetPasswordService(email);
            if (!user) {
                return res.status(404).json({ status: "Failed", message: "Sending OTP is Failed" });
            }
            return res.status(200).json({ status: "success", message: "OTP send Sucessfully", data: [] });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }

    }


    /* ====== Very OTP -----*/
    public static async verifyOtp(req: Request, res: Response) {
        try {
            const { email, otp } = req.body;
            if (!email || !otp) {
                return res.status(400).json({ status: "error", message: "Email and OTP are required", data: [] });
            }
            const user = await UserServices.verifyOtpService(email, otp);
            if (!user) {
                return res.status(404).json({ status: "Failed", message: "OTP verification Failed" });
            }
            return res.status(200).json({ status: "success", message: "OTP verified successfully", data: user });
        } catch (error: any) {
            return errorHandler(error as Error, req, res);
        }
    }


    /* ====== set Location ====*/
    public static async setUserLocation(req: AuthRequest, res: Response) {
        try {
            let result = await UserServices.setUserLocationService(req.user, req.body)
            if (!result) {
                return res.status(404).json({ message: "User not found", data: [], status: "failed" });
            }
            return res.status(200).json({ status: "success", message: "User location updated successfully", data: result });

        } catch (error) {
            return errorHandler(error as Error, req, res);

        }
    }



    /* ===== GET ALL STORES ======*/
    public static async getAllStores(req: AuthRequest, res: Response) {
        try {
            let result = await UserServices.getAllStoresListService(req.user);
            if (!result) {
                return res.status(404).send({
                    message: "Stores not foun",
                    status: "failed",
                    data: []
                })
            }

            return res.status(200).send({
                message: "Stores Fetched Sucessfully",
                status: "Success",
                data: result
            })
        } catch (error) {
            return errorHandler(error as Error, req, res);

        }
    }

    /* ===== GET ALL STORES ======*/
    public static async getStoreListingsBySellerId(req: AuthRequest, res: Response) {
        try {
            let { sellerId, page = 1 } = req.query;
            let sellerIdInt = SetDataTypes.parseInt(sellerId)
            let pageInt = SetDataTypes.parseInt(page)
            let result = await UserServices.getStoreListingsBySellerIdRepo(sellerIdInt, pageInt);
            if (!result) {
                return res.status(404).send({
                    message: "Stores not foun",
                    status: "failed",
                    data: []
                })
            }

            return res.status(200).send({
                message: "Stores Fetched Sucessfully",
                status: "Success",
                data: result
            })
        } catch (error) {
            return errorHandler(error as Error, req, res);

        }
    }

}

export default UserController
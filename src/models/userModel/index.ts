import { Location } from "../../types/interfaces";
export interface User {
    id: number;
    email: string;
    fullName: string | null;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    locationId: number | null;
    verification: Verification | any;
    location: Location | null;
    url: string | null;
    phoneNumber?: string | null;
    coverImage?: string | null;
    deviceToken?: string | null
}


export interface Verification {
    id: number | null;
    userId: number | null;
    resetOtp: number | null;
    resetOtpExpiresAt: Date | null;
    isEmailVerified: string | null;
}

class UserModel {
    id: number;
    email: string;
    fullName: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
    verification: string | null;
    profileType: string | null;
    address: string | null | null;
    profilePic: string | null;
    location: Location | null;
    phoneNumber: string | null;
    coverImage: string | null;

    constructor(
        data: Partial<User>
    ) {
        Object.assign(this, {
            id: data.id,
            email: data.email,
            fullName: data.fullName,
            userType: data.role,
            emailVerified: data.verification?.isEmailVerified ? true : false,
            address: data.location?.address,
            location: this.getLocation(data.location),
            profilePic: data.url ? data.url : null,
            phoneNumber: data.phoneNumber ? data.phoneNumber : null,
            deviceToken: data.deviceToken,
            userSubscription: this.getUserSubscription(data),
            coverImage: data.coverImage ? data.coverImage : null
        });
    }

    /* ========= Get user subscription information * ====== */
    getUserSubscription(data: any): any {
        if (!data.userProfile) {
            return null;
        }
        let payload = {
            id: data.userProfile.id,
            userId: data.userProfile.userId,
            subscription: {
                'subscriptionType': data.userProfile.subscriptionType,
                'postImagesLimit': data.userProfile.postImagesLimit,
                'postAboutTextLimit': data.userProfile.postAboutTextLimit,
                'freeAdAfterLimit': data.userProfile.freeAdAfterLimit,
                'subscriptionPrice': data.userProfile.subscriptionPrice,
                'listingCost': data.userProfile.listingCost,
                'adCost': data.userProfile.adCost,
                'hasFreeAdd': data.userProfile.hasFreeAdd,
                'hasVideo': data.userProfile.hasVideo,
                'hasSocialMediaLinks': data.userProfile.hasSocialMediaLinks
            },
            totalAdsCount: data.userProfile.totalAdsCount,
            adsCountAfterLastSubscription: data.userProfile.adsCountAfterLastSubscription,
            subscriptionDate: data.userProfile.subscriptionDate,
            expiryDate: data.userProfile.expiryDate,

        }
        return payload;
    }

    /* ========= Get location information * ====== */
    getLocation: (location: any) => Location | null = (location: any) => {
        if (!location) {
            return null;
        }
        return {
            id: location.id,
            latitude: location.geolat,
            longitude: location.geolong,
            address: location.address
        };
    }


}

export default UserModel;

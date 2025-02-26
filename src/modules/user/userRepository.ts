import { ProfileTypes, Role } from '@prisma/client';
import { prisma } from '../../prismaClient';

export class UserRepository {
  public static async getAllUsers() {
    return await prisma.user.findMany();
  }

  /* =========== update User Profile Type ========*/
  public static async updateUserProfileTypeRepo(user: number, profileTypeId: number, data: any) {
    try {
      let currentDate = new Date();
      let expiryDate = new Date(currentDate);
      expiryDate.setFullYear(currentDate.getFullYear() + 1);

      let updateUserProfileSubscription = await prisma.userProfile.update({
        where: { userId: user },
        data: {
          adsCountAfterLastSubscription: 0,
          subscriptionType: data.subscriptionType,
          postImagesLimit: data.postImagesLimit,
          postAboutTextLimit: data.postAboutTextLimit,
          freeAdAfterLimit: data.freeAdAfterLimit,
          subscriptionPrice: data.subscriptionPrice,
          listingCost: data.listingCost,
          adCost: data.adCost,
          hasFreeAdd: false,
          hasVideo: false,
          hasSocialMediaLinks: false,
          subscriptionDate: new Date(),
          expiryDate: expiryDate,
        }
      });

      return updateUserProfileSubscription
    } catch (error: any) {
      console.error("Error details:", error);
      throw new Error(`Failed to update user: ${error.message || error}`);
    }
  }

  /* ===== changeRoleRepo =====*/
  public static async changeRoleRepo(user: any, role: Role) {
    try {
      let result = await prisma.user.update({
        where: { id: user.id },
        data: { role },
        include: {
          location: true,
          userProfile: true,
          verification: true
        }

      })
      return result;
    } catch (error: any) {
      console.error("Error details:", error);
      throw new Error(`Failed to update user: ${error.message || error}`);
    }
  }


  /* ======= Update Profile =====*/
  public static async updateUserProfileRepo(user: any, data: any) {
    try {
      let result = await prisma.user.update({
        where: { id: user.id },
        data: {
          fullName: data.fullName,
          phoneNumber: data.phoneNumber,
          url: data.profilePic
        },
        include: {
          location: true,
          userProfile: true,
          verification: true
        }
      });
      return result;
    } catch (error: any) {
      console.error("Error details:", error);
      throw new Error(`Failed to update user: ${error.message || error}`);
    }
  }


  /* ======= Update Password =====*/
  public static async changePasswordRepo(user: any, password: string) {
    try {
      let result = await prisma.user.update({
        where: { id: user.id },
        data: {
          password: password,
        },
        include: {
          location: true,
          userProfile: true,
          verification: true
        }
      });
      return result;
    } catch (error: any) {
      console.error("Error details:", error);
      throw new Error(`Failed to update user: ${error.message || error}`);
    }
  }


  /* ===== GET ALL Users ====*/
  public static async getUsersListRepo(
    page: number = 1,
    limit: number = 10,
    search: string = '',
    profileType: ProfileTypes | "STANDARD" | '' | 'DEFAULT',
    role: any = ['BUYER', 'SELLER']
  ) {
    try {
      let query: any = {
        where: {
          fullName: {
            contains: search,
            mode: 'insensitive'
          },
          role: {
            notIn: ["ADMIN"],
          }
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          userProfile: true,
          verification: true
        }
      };


      if (profileType != '' && profileType != "DEFAULT") {
        query.where.userProfile = {
          subscriptionType: profileType
        };
      }

      if (role && role != '' && role != "DEFAULT") {
        query.where.role.in = [role]

      }
      let result = await prisma.user.findMany(query);

      let totalCount = await UserRepository.getUserTotalCountByWhereClauseRepo(query)

      return {
        result,
        totalCount
      };

    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to get users list: ${error.message}`);
    }
  }

  /* ------ USER TOTAL COUTN BY WHERE CAUSE ______----*/
  public static async getUserTotalCountByWhereClauseRepo(whereClause: any) {
    try {
      let totalCount = await prisma.user.count({
        where: whereClause.where
      });
      return totalCount
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to get User Count: ${error.message}`);
    }
  }



  /* ====== set Location ====*/
  public static async setUserLocationRepo(user: any, payload: any) {
    try {
      const existingLocation = await prisma.location.findFirst({
        where: {
          user: {
            id: user.id
          }
        }
      });

      let result;

      if (existingLocation) {
        result = await prisma.location.update({
          where: {
            id: existingLocation.id
          },
          data: {
            geolat: payload.latitude,
            geolong: payload.longitude,
            address: payload.address,
            updatedAt: new Date()
          }
        });
      } else {
        result = await prisma.location.create({
          data: {
            geolat: payload.latitude,
            geolong: payload.longitude,
            address: payload.address,
            user: {
              connect: {
                id: user.id
              }
            }
          }
        });
      }

      const userWithLocation = await prisma.user.update({
        where: { id: user.id },
        data: {
          location: {
            connectOrCreate: {
              where: {
                id: result.id
              },
              create: result
            }
          }
        },
        include: {
          location: true,
          userProfile: true,
          verification: true
        }
      });

      return userWithLocation;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to set user location: ${error.message}`);
    }
  }

  /* ------- GET ALL STores LIST ----*/
  public static async getAllStoresListRepo(whereClause: any) {
    try {
      let result = await prisma.user.findMany(whereClause);
      return result
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to set user location: ${error.message}`);
    }
  }
  /* ------- GET ALL Reviews COUNT FOR GIVEN SELLER IDS ----*/
  public static async getUserReviewsCount(sellerIds: number[]) {
    try {
      const reviewCountPromises = sellerIds.map(async (sellerId) => {
        const reviewCount = await prisma.profileReviews.count({
          where: {
            sellerId: sellerId
          }
        });
        return { sellerId, reviewCount };
      });

      /* ---- Get Promise Count Review --- */
      const reviewCounts = await Promise.all(reviewCountPromises);
      return reviewCounts;
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to get user reviews count: ${error.message}`);
    }
  }


  /* ------ GET STORES COUNT ---*/
  public static async getAllStoresCountRepo(role: any = "SELLER") {
    try {
      let totalCount = await prisma.user.count();
      return totalCount
    } catch (error: any) {
      console.log("error", error);
      throw new Error(`Failed to set user location: ${error.message}`);
    }
  }

}
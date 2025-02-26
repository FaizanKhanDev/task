// import { NextFunction, Request, Response } from "express";

// export const authorization = (roles: string[]) => {

//   interface userPayload {
//     id: string
//     name: string
//     email: string
//     password: string
//     role: string
//   }
//   let userPayload = {}
//   return async (req: Request, res: Response, next: NextFunction) => {
//     const userRepo = userPayload; 
//     const user = await userRepo.findOne({
//       where: { id: req["currentUser"].id },
//     });
//     console.log(user);
//     if (!roles.includes(user.role)) {
//       return res.status(403).json({ message: "Forbidden" });
//     }
//     next();
//   };
// };

import { Request, Response } from "express";
import { ERROR_MESSAGES } from "../constant/errorMessages";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
) => {
  console.error(`Error Handler: ${error.message}`);
  let statusCode = 500;
  switch (error.message) {
    case ERROR_MESSAGES.INTERNAL_SERVER_ERROR:
      statusCode = 500;
      break;
    case ERROR_MESSAGES.UNPROCESSABLE_ENTITY:
      statusCode = 422;
      break;
    case ERROR_MESSAGES.NOT_FOUND:
      statusCode = 404;
      break;
    case ERROR_MESSAGES.FORBIDDEN:
      statusCode = 403;
      break;
    case ERROR_MESSAGES.UNAUTHORIZED:
      statusCode = 401;
      break;
    case ERROR_MESSAGES.TOO_MANY_REQUESTS:
      statusCode = 429;
      break;
    case ERROR_MESSAGES.CONFLICT:
      statusCode = 409;
      break;
    case ERROR_MESSAGES.OTPEXPIRED:
      statusCode = 400;
    case ERROR_MESSAGES.INVALIDOTP:
      statusCode = 400;
    case ERROR_MESSAGES.EMAILALREADYVERIFIED:
      statusCode = 400;
    case ERROR_MESSAGES.USERNOTFOUND:
      statusCode = 404;
    case ERROR_MESSAGES.EMAILNOTVERIFIED:
      statusCode = 403
      break;
    default:
      statusCode = 500;
      break;
  }
  return res.status(statusCode).json({ status: "Failed", message: error.message, hint: "collaborate with Backend developer", data: [] });
};

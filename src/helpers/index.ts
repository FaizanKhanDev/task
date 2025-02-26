import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import * as dotenv from "dotenv";
import path from 'path';
import fs from 'fs';
interface payload {
  [key: string]: any;
}
dotenv.config();
const { JWT_SECRET = "" } = process.env;

/*  ========= Encrypt Password ========= */
export class Encrypt {

  /* ========= Encrypt Password ========= */
  static async encryptpass(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
  }

  /* ========= Compare Password ========= */
  static comparepassword = async (password: string, hashPassword: string,): Promise<boolean> => {
    let isPasswordValid = await bcrypt.compare(password, hashPassword);
    return isPasswordValid
  }

  /* ========= generate token ========= */
  static generateToken(payload: payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "30d" });
  }
}

/*  ========= Decrypt token ========= */
export class Decrypt {

  /* ========= Decrypt token ========= */
  static decryptToken = async (token: string) => {
    try {
      let decoded = await jwt.verify(token, JWT_SECRET);
      return decoded;
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}



/* ========= Set Data Types ========= */
export class SetDataTypes {
  static parseInt(id: any): number {
    let intId = parseInt(id);
    return intId;
  }

  static hasId(result: any): result is { id: string } {
    return result && typeof result.id == 'string';
  }
}

/* -------- trim string -------- */
export const trim = (str: string) => {
  return str.replace(/\s+/g, '');
}

/* ------- Get Current Date ------- */
export const getCurrentDate = () => {
  let date = new Date();
  return date;
}


/* ------- Get Current Time ------- */
export const getCurrentTime = () => {
  let time = new Date();
  return time;
}






/*  ========= File ========= */
export class File {

  /* ========= Get File Name ========= */
  public static getFileName = async (file: string) => {
    const { name, ext } = path.parse(file);
    const fileName = `${name}${ext}`;
    return fileName;
  }

  /* ================= Get file path ============== */
  static getFilePath = async (fileName: string) => {
    const __dirname = path.dirname(path.dirname(path.dirname(fileName)));
    const filePath = path.resolve(__dirname, 'src', 'public', 'uploads', 'files', fileName);
    return filePath;
  }

  /* ================ REMOVE FILE FROM SYSTEM ============ */
  public static removeFileFromFs = async (params: string): Promise<{ status: string, message: string }> => {
    try {
      const fileName = await File.getFileName(params);
      if (!fileName) {
        throw new Error("File Name is Invalid");
      }

      const filePath = await File.getFilePath(fileName);

      // Check if file exists
      await fs.promises.access(filePath, fs.constants.F_OK);

      // Delete file
      await fs.promises.unlink(filePath);

      return { status: "Success", message: "File deleted successfully" };
    } catch (err: any) {
      if (err.code === 'ENOENT') {
        // File does not exist
        return { status: "error", message: "File not found" };
      } else {
        // Other errors
        return { status: "error", message: `Error: ${err.message}` };
      }
    }
  };
}


/* === Generate OTP === */

export class OTPGenerator {
  /* === Generate OTP === */
  static generateOTP() {
    let OTP = Math.floor(100000 + Math.random() * 900000);
    return OTP;
  }
}


export const reorderListings = (listings: any) => {
  // Separate featured and non-featured listings
  const featured = listings.filter((listing: any) => listing.isFeatured);
  const nonFeatured = listings.filter((listing: any) => !listing.isFeatured);

  const reordered = [];
  let i = 0; // Index for featured listings
  let j = 0; // Index for non-featured listings

  // Define the pattern
  const featuredCount = 2;
  const nonFeaturedCount = 12;

  // Continue while there are listings to add
  while (i < featured.length || j < nonFeatured.length) {
    // Add featured listings (up to 2 at a time)
    for (let k = 0; k < featuredCount && i < featured.length; k++) {
      reordered.push(featured[i++]);
    }

    // Add non-featured listings (up to 12 at a time)
    for (let k = 0; k < nonFeaturedCount && j < nonFeatured.length; k++) {
      reordered.push(nonFeatured[j++]);
    }
  }

  return reordered;
}
/* ----------- Useed in Dashboad FInding the Difference --------*/
export const aggregateCountsByMonth = (data: any[]): number => {
  return data.reduce((total, item) => total + item._count._all, 0);
}
/* ----------- Useed in Dashboad FInding the Difference --------*/
export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
}
import { dbConnect } from "@/lib/dbConnect";
import { sendResponse } from "@/lib/response";
import User from "@/models/User";
import bcrypt from "bcryptjs";  // Import bcrypt for manual password comparison
import jwt from "jsonwebtoken";  // Import jwt for generating token

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendResponse(res, false, "Method Not Allowed", null, null, 405);
  }

  try {
    await dbConnect();
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, false, "Invalid credentials", null, null, 401);
    }


    // // Use bcrypt.compare() to verify password against the stored hash
    // const isMatch = await bcrypt.compare(password, user.password);
    // console.log("Password Comparison Result:", isMatch);  // Log comparison result

    // if (!isMatch) {
    //   console.log("Password comparison failed!");
    //   return sendResponse(res, false, "Invalid credentials", null, null, 401);
    // }

    // If passwords match, generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_ACCESS_EXPIRY || "15m",
    });

    return sendResponse(res, true, "Login successful", { token });

  } catch (error) {
    return sendResponse(res, false, "Server Error", null, error.message, 500);
  }
}

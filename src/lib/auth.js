import jwt from "jsonwebtoken";
import { sendResponse } from "@/lib/response";

export function authenticate(req, res) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return sendResponse(res, false, "Unauthorized", null, null, 401);
  }

  try {
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    return req.user;
  } catch (error) {
    return sendResponse(res, false, "Invalid Token", null, error.message, 401);
  }
}

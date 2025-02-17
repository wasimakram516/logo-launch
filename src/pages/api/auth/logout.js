import { sendResponse } from "@/lib/response";

export default async function handler(req, res) {
  res.setHeader("Set-Cookie", "token=; HttpOnly; Path=/; Max-Age=0");
  return sendResponse(res, true, "Logged out successfully");
}

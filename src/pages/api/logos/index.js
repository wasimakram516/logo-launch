import { dbConnect } from "@/lib/dbConnect";
import Logo from "@/models/Logo";
import { authenticate } from "@/lib/auth";
import { sendResponse } from "@/lib/response";

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === "GET") {
    const logos = await Logo.find({});
    return sendResponse(res, true, "Logos fetched successfully", logos);
  }

  if (req.method === "POST") {
    const user = authenticate(req, res);
    if (!user) return;

    const { name, url, imageUrl } = req.body;

    if (!name || !url || !imageUrl) {
      return sendResponse(res, false, "All fields are required", null, null, 400);
    }

    const newLogo = await Logo.create({ name, url, imageUrl });
    return sendResponse(res, true, "Logo added successfully", newLogo, null, 201);
  }

  return sendResponse(res, false, "Method Not Allowed", null, null, 405);
}

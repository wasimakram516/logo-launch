import { dbConnect } from "@/lib/dbConnect";
import Logo from "@/models/Logo";
import { authenticate } from "@/lib/auth";
import { sendResponse } from "@/lib/response";
import { deleteImage } from "@/lib/cloudinary";

export default async function handler(req, res) {
  await dbConnect();
  const { id } = req.query;

  if (req.method === "GET") {
    const logo = await Logo.findById(id);
    if (!logo) return sendResponse(res, false, "Logo not found", null, null, 404);
    return sendResponse(res, true, "Logo fetched successfully", logo);
  }

  if (req.method === "PUT") {
    const user = authenticate(req, res);
    if (!user) return;

    const { name, url, imageUrl } = req.body;
    if (!name || !url || !imageUrl) {
      return sendResponse(res, false, "All fields are required", null, null, 400);
    }

    const existingLogo = await Logo.findById(id);
    if (!existingLogo) return sendResponse(res, false, "Logo not found", null, null, 404);

    // ✅ Delete old image from Cloudinary if image URL is changed
    if (existingLogo.imageUrl !== imageUrl) {
      await deleteImage(existingLogo.imageUrl);
    }

    const updatedLogo = await Logo.findByIdAndUpdate(id, { name, url, imageUrl }, { new: true });

    return sendResponse(res, true, "Logo updated successfully", updatedLogo);
  }

  if (req.method === "DELETE") {
    const user = authenticate(req, res);
    if (!user) return;

    const logo = await Logo.findById(id);
    if (!logo) return sendResponse(res, false, "Logo not found", null, null, 404);

    // ✅ Delete logo image from Cloudinary
    await deleteImage(logo.imageUrl);
    await Logo.findByIdAndDelete(id);

    return sendResponse(res, true, "Logo deleted successfully");
  }

  return sendResponse(res, false, "Method Not Allowed", null, null, 405);
}

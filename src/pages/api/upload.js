import cloudinary from "@/lib/cloudinary";
import { sendResponse } from "@/lib/response";
import multiparty from "multiparty";

export const config = {
  api: {
    bodyParser: false, // Disable default bodyParser for file handling
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return sendResponse(res, false, "Method Not Allowed", null, null, 405);
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return sendResponse(res, false, "Form parsing error", null, err.message, 500);
    }

    if (!files.image || files.image.length === 0) {
      return sendResponse(res, false, "Image is required", null, null, 400);
    }

    const file = files.image[0];

    // ✅ Ensure images are stored in `CLOUDINARY_FOLDER/Logos`
    const cloudinaryFolder = `${process.env.CLOUDINARY_FOLDER}/Logos`;

    try {
      // ✅ Upload image to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(file.path, {
        folder: cloudinaryFolder,
        width: 500, // Resize width to 500px
        crop: "scale", // Maintain aspect ratio
        quality: "auto", // Optimize quality
      });

      return sendResponse(res, true, "Image uploaded successfully", { url: uploadResponse.secure_url });
    } catch (error) {
      return sendResponse(res, false, "Cloudinary Upload Failed", null, error.message, 500);
    }
  });
}

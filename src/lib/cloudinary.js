import { v2 as cloudinary } from "cloudinary";

// ✅ Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ Delete Image from Cloudinary
export const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    const urlParts = imageUrl.split("/");
    const fileName = urlParts[urlParts.length - 1].split(".")[0]; // Extract filename
    const fullFolderPath = urlParts.slice(-3, -1).join("/"); // Extract full folder path (last 3 parts)

    const publicId = `${fullFolderPath}/${fileName}`; // Correct Public ID

    console.log(`🛑 Deleting image with Public ID: ${publicId}`);

    const result = await cloudinary.uploader.destroy(publicId, { invalidate: true });
    console.log(`✅ Cloudinary Response:`, result);
  } catch (error) {
    console.error("❌ Cloudinary Deletion Failed:", error);
  }
};

// ✅ Export Cloudinary instance
export default cloudinary;

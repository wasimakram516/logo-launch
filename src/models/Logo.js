import mongoose from "mongoose";

const LogoSchema = new mongoose.Schema({
  name: {
    type: String,
    enum: ["analytical", "process"], // ✅ Restricts values to these two categories
    required: true,
  },
  url: { type: String, required: true }, // Hyperlink for iframe
  imageUrl: { type: String, required: true }, // Cloudinary or local image URL
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Logo || mongoose.model("Logo", LogoSchema);

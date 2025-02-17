import bcrypt from "bcryptjs"; // Add bcrypt import
import User from "@/models/User";
import { dbConnect } from "./dbConnect";

export async function seedAdminUser() {
  try {
    console.log("🔹 Running Admin Seeder...");
    await dbConnect(); // Confirm DB connection
    console.log("🔹 Database connected successfully.");

    const email = "admin@wwds.com";
    const password = "Admin@WWDS#2025";

    const existingAdmin = await User.findOne({ email });

    if (!existingAdmin) {
      console.log("🔹 Admin not found, creating new one...");
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create admin with hashed password
      await User.create({
        email: email,
        password: hashedPassword,
      });

      console.log(`✅ Admin user created: ${email} / ${password}`);
    } else {
      console.log("🔹 Admin user already exists.");
    }
  } catch (error) {
    console.error("❌ Error seeding admin user:", error);
  }
}

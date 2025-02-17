import mongoose from "mongoose";
import { seedAdminUser } from "@/lib/adminSeeder"; // Import the seeder function

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      console.log("✅ Database Connected");
      return mongoose;
    });
  }

  cached.conn = await cached.promise;

  // After database connection, seed the admin user
  await seedAdminUser();  // Ensure seeding happens after connection

  return cached.conn;
}

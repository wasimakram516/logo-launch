import { seedAdminUser } from "@/lib/adminSeeder";
import { sendResponse } from "@/lib/response";

export default async function handler(req, res) {
  
  try {
    await seedAdminUser();
    return sendResponse(res, true, "Admin seeding completed.");
  } catch (error) {
    return sendResponse(res, false, "Error seeding admin user.", null, error.message, 500);
  }
}

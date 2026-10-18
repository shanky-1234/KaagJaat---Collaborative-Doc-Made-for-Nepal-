require("dotenv").config();

const cloudinary = require("./config/cloudinary");

async function testConnection() {
  try {
    const result = await cloudinary.api.ping();
    console.log("Cloudinary connection successful:", result);
  } catch (error) {
    console.error("Cloudinary connection failed:", error.message);
  }
}

testConnection();
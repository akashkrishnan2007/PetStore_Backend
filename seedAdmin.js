require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./Models/AdminModel");

(async () => {
  await mongoose.connect(process.env.MONGO_URL);

  const email = "admin@petzone.com";
  const password = await bcrypt.hash("Admin123", 10);

  await Admin.findOneAndUpdate(
    { email },
    { name: "Admin", email, password },
    { upsert: true, new: true }
  );

  console.log("Admin seeded: admin@petzone.com / Admin123");
  await mongoose.disconnect();
})();

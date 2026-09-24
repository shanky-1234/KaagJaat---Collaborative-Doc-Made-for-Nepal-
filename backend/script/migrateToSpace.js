const mongoose = require("mongoose");
require("dotenv").config()
const UserModel = require("../Models/userModel");
const DocumentModel = require("../Models/documentModel");
const SpaceModel = require("../Models/spaceModel");

const migrateToSpaces = async () => {
  try {
    const users = await UserModel.find();

    console.log(`Found ${users.length} users`);

    for (const user of users) {
      let personalSpace = await SpaceModel.findOne({
        ownerUser: user._id,
        isPersonal: true,
      });

      if (!personalSpace) {
        personalSpace = await SpaceModel.create({
          name: "Personal Space",
          ownerUser: user._id,
          isPersonal: true,
        });

        console.log(`Created Personal Space for ${user.email}`);
      }

      const result = await DocumentModel.updateMany(
        {
          ownerUser: user._id,
          space: { $exists: false },
        },
        {
          $set: {
            space: personalSpace._id,
          },
        }
      );

      console.log(
        `${user.email}: ${result.modifiedCount} documents migrated`
      );
    }

    console.log("Migration completed successfully.");
  } catch (error) {
    console.error("Migration failed:", error);
  }
};

const runMigration = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    console.log("MongoDB connected");

    await migrateToSpaces();

    await mongoose.disconnect();

    console.log("MongoDB disconnected");
  } catch (error) {
    console.error("Migration connection failed:", error);
    process.exit(1);
  }
};

runMigration();
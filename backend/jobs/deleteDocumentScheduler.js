
const cron = require("node-cron");
const documentModel = require("../Models/documentModel");
const folderModel = require("../Models/folderModel");

const cleanupTrash = async () => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const result = await documentModel.deleteMany({
            isTrash: true,
            trashDate: { $lte: sevenDaysAgo }
        });

        const expiredFolders = await folderModel.find({
            isTrash: true,
            trashDate: { $lte: sevenDaysAgo }
        }).select("_id ownerUser");

        for (const folder of expiredFolders) {
            await documentModel.deleteMany({
                folder: folder._id,
                ownerUser: folder.ownerUser
            });
        }

        const deletedFolders = await folderModel.deleteMany({
            _id: { $in: expiredFolders.map((folder) => folder._id) },
            isTrash: true,
            trashDate: { $lte: sevenDaysAgo }
        });

        console.log(
            `Permanently deleted ${result.deletedCount} expired documents and ${deletedFolders.deletedCount} expired folders`
        );
    } catch (error) {
        console.error("Trash cleanup failed:", error);
    }
};

const startTrashCleanup = () => {
    // Check existing trash immediately when the server starts
    cleanupTrash();

    // Then check every hour
    cron.schedule("0 * * * *", cleanupTrash);
};

module.exports = startTrashCleanup;

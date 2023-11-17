import unzipper from "unzipper";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadZippedFolders = async (req, res) => {
  try {
    const folder1Zip = req.files["folder1Zip"][0];
    const folder2Zip = req.files["folder2Zip"][0];

    if (!fs.existsSync(folder1Zip.path) && !fs.existsSync(folder2Zip.path)) {
      throw new Error("Newly uploaded ZIP folders do not exist");
    }

    // Delete any older ZIP folders in the uploadedImages directory
    fs.readdirSync("uploadedImages").forEach((file) => {
      if (
        file.endsWith(".zip") &&
        file !== folder1Zip.originalname &&
        file !== folder2Zip.originalname
      ) {
        fs.unlinkSync(path.join("uploadedImages", file));
      }
    });

    res.status(200).json({ message: "Upload and processing successful" });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

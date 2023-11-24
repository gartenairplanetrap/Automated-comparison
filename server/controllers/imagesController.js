import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createExcelWorkbook } from "../services/tableController.js";
import { applyStencilsToImage } from "../services/stencil.js";
import { compareImagesInFolders } from "../services/compareImagesInFolders.js";
import { deleteFolderContents } from "../services/deleteFolderContents.js";
import { extractAndHandleRetry } from "../services/extractAndHandleRetry.js";
import {
  createZipFile,
  outputZippedFolders,
} from "../services/createZipFile.js";

import { io } from "../server.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadZippedFolders = async (req, res) => {
  const timestamp = new Date();
  const formattedDateTime = timestamp.toISOString().replace(/:/g, "-");

  // Create a unique file name based on the timestamp
  const zipFileName = `${formattedDateTime}.zip`;

  try {
    if (!req.files["folder1Zip"] || !req.files["folder1Zip"][0]) {
      console.error("Missing folder1Zip file");
      res.status(400).json({ message: "Missing folder1Zip file" });
      return;
    }
    const { screenSize, type, prl } = req.body;

    const folder1Zip = req.files["folder1Zip"][0];
    const folder2Zip = req.files["folder2Zip"][0];

    // Check if folder1Zip exists and is not empty
    if (!fs.existsSync(folder1Zip.path) || !fs.statSync(folder1Zip.path).size) {
      console.warn("folder1Zip is missing or empty");
      res.status(400).json({ message: "Invalid folder1Zip file" });
      return;
    }

    // Check if folder2Zip exists and is not empty
    if (!fs.existsSync(folder2Zip.path) || !fs.statSync(folder2Zip.path).size) {
      console.warn("folder2Zip is missing or empty");
      res.status(400).json({ message: "Invalid folder2Zip file" });
      return;
    }

    // Define target paths for extracted folders
    const folder1Path = path.join(__dirname, `../uploadedImages/folder1`);
    const folder2Path = path.join(__dirname, `../uploadedImages/folder2`);
    const comparisonFolder = path.join(
      __dirname,
      `../uploadedImages/result/comparison`
    );
    const mismatchTableFolder = path.join(
      __dirname,
      `../uploadedImages/result/mismatches_tables`
    );
    const zippedFolder = path.join(
      __dirname,
      `../uploadedImages/zippedFolders`
    );

    // Delete existing contents of the target directories
    deleteFolderContents(folder1Path);
    deleteFolderContents(folder2Path);
    deleteFolderContents(comparisonFolder);
    deleteFolderContents(mismatchTableFolder);
    deleteFolderContents(zippedFolder);

    // Unzip directly to the target directories

    io.emit("progress", "Unzipping and processing folders...");

    await Promise.allSettled([
      extractAndHandleRetry(folder1Zip.path, folder1Path),
      extractAndHandleRetry(folder2Zip.path, folder2Path),
    ]);

    // Delete the uploaded ZIP folders after extraction
    if (fs.existsSync(folder1Zip.path)) {
      fs.unlinkSync(folder1Zip.path);
    }
    if (fs.existsSync(folder2Zip.path)) {
      fs.unlinkSync(folder2Zip.path);
    }

    io.emit("progress", "Applying stencils to the images...");

    await applyStencilsToImage(folder1Path, folder1Path, screenSize, type, prl);
    await applyStencilsToImage(folder2Path, folder2Path, screenSize, type, prl);

    const progressCallback = (message) => {
      io.emit("compare", message);
    };

    const mismatchResults = await compareImagesInFolders(
      folder1Path,
      folder2Path,
      progressCallback
    );

    // Save mismatch results in a table
    const table = await createExcelWorkbook(mismatchResults);

    const folderToZip = path.join(__dirname, `../uploadedImages/result`);

    const zippedFolderPath = await createZipFile(
      folderToZip,
      `${outputZippedFolders}${zipFileName}`
    );

    io.emit("download", "Downloading compared images & mismatches table....");
    res.status(200).json({
      zipFileName,
      zippedFolderPath,
      message: "Upload and processing successful",
    });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

//download the zipped folder

export function downloadZippedFolder(req, res) {
  const { fileName, filePath } = req.body;

  // Send the file as a response for download
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error sending file:", err);
      res.status(500).send("Internal Server Error");
    }
  });
}

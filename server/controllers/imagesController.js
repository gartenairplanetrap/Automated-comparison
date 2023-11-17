import extract from "extract-zip";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadZippedFolders = async (req, res) => {
  try {
    const folder1Zip = req.files["folder1Zip"][0];
    const folder2Zip = req.files["folder2Zip"][0];

    // Define target paths for extracted folders
    const folder1Path = path.join(__dirname, `../uploadedImages/folder1`);
    const folder2Path = path.join(__dirname, `../uploadedImages/folder2`);

    // Delete existing contents of the target directories
    deleteFolderContents(folder1Path);
    deleteFolderContents(folder2Path);

    // Unzip directly to the target directories
    await Promise.all([
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

    res.status(200).json({ message: "Upload and processing successful" });
  } catch (error) {
    console.error("Error during upload:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

async function extractAndHandleRetry(zipPath, outputPath) {
  const maxRetries = 3;
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await extract(zipPath, { dir: outputPath });
      console.log(`Unzipped and saved to: ${outputPath}`);
      return;
    } catch (error) {
      console.error(`Extraction failed with error: ${error}`);
      retries++;
      console.log(`Retrying extraction for ${zipPath} - Retry ${retries}`);
    }
  }

  console.error(`Failed to extract ${zipPath} after ${maxRetries} retries.`);
  throw new Error(`Failed to extract ${zipPath}`);
}

// Delete all files and folders inside a directory
function deleteFolderContents(directory) {
  try {
    if (fs.existsSync(directory)) {
      fs.readdirSync(directory).forEach((file) => {
        const filePath = path.join(directory, file);
        const fileStat = fs.statSync(filePath);

        if (fileStat.isDirectory()) {
          // If it's a directory, delete its contents recursively
          deleteFolderContents(filePath);
          fs.rmdirSync(filePath);
        } else {
          // If it's a file, close any open handles before deletion
          const fileHandle = fs.openSync(filePath, "r+");
          fs.closeSync(fileHandle);
          fs.unlinkSync(filePath);
        }
      });
    }
  } catch (error) {
    console.error("Error deleting folder contents:", error);
    throw error;
  }
}

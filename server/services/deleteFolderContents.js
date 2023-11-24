import fs from "fs";
import path from "path";
// Delete all files and folders inside a directory
export function deleteFolderContents(directory) {
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

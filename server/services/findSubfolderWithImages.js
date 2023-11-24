import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function findSubfolderWithImages(folderPath) {
  const subfolders = await fs.promises.readdir(folderPath);

  for (const subfolder of subfolders) {
    const subfolderPath = path.join(folderPath, subfolder);
    const stats = await fs.promises.stat(subfolderPath);
    if (stats.isDirectory()) {
      const files = await fs.promises.readdir(subfolderPath);
      const imageFiles = files.filter((file) =>
        /\.(png|jpe?g|gif|bmp)$/i.test(file)
      );
      if (imageFiles.length > 0) {
        return subfolderPath;
      }
    }
  }
  return null;
}

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import resemble from "resemblejs";
import { findSubfolderWithImages } from "../services/findSubfolderWithImages.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function compareImagesInFolders(
  folder1Path,
  folder2Path,
  progressCallback
) {
  const subfolder1Path = await findSubfolderWithImages(folder1Path);
  const subfolder2Path = await findSubfolderWithImages(folder2Path);

  if (!subfolder1Path || !subfolder2Path) {
    console.log("Subfolders with images not found.");
    return [];
  }

  const mismatchResults = [];
  let totalImages = 0;

  const subfolder1Files = await fs.promises.readdir(subfolder1Path);
  const subfolder2Files = new Set(await fs.promises.readdir(subfolder2Path));

  const imagesToCompare = subfolder1Files.filter((file) =>
    subfolder2Files.has(file)
  ).length;
  totalImages += imagesToCompare;

  progressCallback(`Start comparing ${imagesToCompare} images`);

  console.log(`Found ${imagesToCompare} images to compare.`);

  const comparisons = subfolder1Files
    .filter((file) => subfolder2Files.has(file))
    .map(async (file) => {
      const img1Path = path.join(subfolder1Path, file);
      const img2Path = path.join(subfolder2Path, file);

      const outputFolderPath = path.join(
        __dirname,
        `../uploadedImages/result/comparison`
      );

      const outputImagePath = path.join(outputFolderPath, file);

      // Check if output folder exists, create if it doesn't
      if (!fs.existsSync(outputFolderPath)) {
        fs.mkdirSync(outputFolderPath, { recursive: true });
      }

      console.log(`Comparing images: ${file}`);

      // Compare images using Resemble.js
      const comparison = await new Promise((resolve, reject) => {
        resemble(img1Path)
          .compareTo(img2Path)
          .scaleToSameSize()
          .onComplete(resolve);
      });

      // Save comparison image (diff image) in a third folder
      fs.writeFileSync(outputImagePath, comparison.getBuffer());

      // Collect mismatch results
      if (comparison.rawMisMatchPercentage > 0) {
        mismatchResults.push({
          imageName: file,
          mismatchPercentage: comparison.rawMisMatchPercentage,
        });
      }
    });

  await Promise.allSettled(comparisons);

  console.log(`Total images to compare: ${totalImages}`);
  console.log("Comparison process completed.");

  return mismatchResults;
}

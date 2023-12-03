import fs from "fs";
import { data } from "../stencilsInputs.js";
import path from "path";
import { fileURLToPath } from "url";
import Jimp from "jimp";
import { findSubfolderWithImages } from "./findSubfolderWithImages.js";
import { Stencil } from "../models/stencil.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function applyStencilsToImage(
  folderPath,
  outputImagePath,
  screenSize,
  type,
  prl
) {
  try {
    const inputImage = await findSubfolderWithImages(folderPath);

    if (!inputImage) {
      console.log("Subfolders with images not found.");
      return [];
    }

    const inputImageFiles = await fs.promises.readdir(inputImage);

    await Promise.allSettled(
      inputImageFiles.map(async (image) => {
        const stencils = await findStencils(image, screenSize, type, prl);
        console.log("stencil", stencils);
        if (stencils.length > 0) {
          const imagePath = path.join(inputImage, image);

          await applyStencilsToSingleImage(
            imagePath,
            stencils,
            outputImagePath
          );
        }
      })
    );
  } catch (error) {
    throw new Error(`Error applying stencils to image: ${error.message}`);
  }
}

async function applyStencilsToSingleImage(
  imagePath,
  stencils,
  outputImagePath
) {
  try {
    const outputImage = await findSubfolderWithImages(outputImagePath);
    const originalImage = await Jimp.read(imagePath); // Read the original image once

    for (const stencil of stencils) {
      const processedImage = originalImage.clone(); // Clone the original image for each stencil

      for (const item of stencil.items) {
        // Create a temporary object to store converted values
        const numericItem = {};

        for (const property in item) {
          if (property !== "color" && typeof item[property] === "string") {
            numericItem[property] = Number(item[property]);
          } else {
            numericItem[property] = item[property];
          }
        }

        const { width, height, top, left, color } = numericItem;

        // Create a mask for the specified area with the given color
        const mask = new Jimp(width, height, color);

        // Composite the mask onto the image
        processedImage.composite(mask, left, top);
      }

      // Write the processed image with stencils applied to the output folder
      const imageName = stencil.itemName;
      const outputPath = `${outputImage}/${imageName}.png`; // Output path for each stencil image
      await processedImage.writeAsync(outputPath);
      console.log(`Stencil applied for ${imageName}`);
    }
  } catch (error) {
    throw new Error(`Error applying stencils to image: ${error.message}`);
  }
}

async function findStencils(itemName, screenSize, type, prl) {
  // Filter stencils based on the provided criteria

  const itemNameWithoutExtension = itemName.split(".").slice(0, -1);
  try {
    const stencils = await Stencil.find({});

    const foundStencils = stencils.filter(
      (stencil) =>
        stencil.itemName.trim() === itemNameWithoutExtension[0].trim() &&
        stencil.screenSize == screenSize &&
        stencil.type === type.toLowerCase() &&
        stencil.prl === prl.toLowerCase()
    );

    return foundStencils;
  } catch (error) {
    console.log(error);
  }
}

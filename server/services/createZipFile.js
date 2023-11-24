import fs from "fs";
import archiver from "archiver";

// Function to create a zip file of a folder
export const outputZippedFolders =
  "C:/Users/WaseemAltinawi/skinning/AutomatedComparison/server/uploadedImages/zippedFolders/output.zip";

export async function createZipFile(folderPath, outputZipPath) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputZipPath);

    console.log("folderPath", folderPath);
    console.log("outputZipPath", outputZipPath);

    output.on("error", (err) => {
      console.error("Error creating output stream:", err);
      reject(err);
    });

    const archive = archiver("zip", {
      zlib: { level: 9 },
    });

    archive.on("warning", (err) => {
      if (err.code === "ENOENT") {
        console.warn("Warning - file not found:", err);
      } else {
        console.error("Error in archive:", err);
        reject(err);
      }
    });

    archive.on("error", (err) => {
      console.error("Error in archive:", err);
      reject(err);
    });

    archive.on("end", () => {
      console.log("Archive finished");
      resolve(outputZipPath);
    });

    archive.pipe(output);
    archive.directory(folderPath, false); // Add the contents of the folder to the zip file

    archive.finalize();
  });
}

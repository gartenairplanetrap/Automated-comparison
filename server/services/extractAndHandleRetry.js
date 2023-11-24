import extract from "extract-zip";
export async function extractAndHandleRetry(zipPath, outputPath) {
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

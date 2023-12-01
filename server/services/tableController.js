import ExcelJS from "exceljs";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createExcelWorkbook(mismatchResults) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Mismatch Results");
  const today = new Date();
  const formattedDateTime = today.toISOString().replace(/:/g, "-");

  worksheet.columns = [
    { header: "Image Name", key: "imageName", width: 20 },
    { header: "Mismatch Percentage", key: "mismatchPercentage", width: 20 },
  ];

  mismatchResults.forEach((result) => {
    const formattedPercentage = Number(
      parseFloat(result.mismatchPercentage).toFixed(2)
    );
    worksheet.addRow({
      imageName: result.imageName,
      mismatchPercentage: `${formattedPercentage}%`,
    });
  });

  const outputFolderPath = path.join(
    __dirname,
    `../uploadedImages/result/mismatches_tables`
  );

  if (!fs.existsSync(outputFolderPath)) {
    fs.mkdirSync(outputFolderPath, { recursive: true });
  }

  const outputFilePath = path.join(
    outputFolderPath,
    `${formattedDateTime}.xlsx`
  );

  await workbook.xlsx.writeFile(outputFilePath);

  const fileContents = await fs.promises.readFile(outputFilePath);

  return fileContents;
}

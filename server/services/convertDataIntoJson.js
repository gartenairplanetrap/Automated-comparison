import fs from "fs";
const path =
  "C:/Users/WaseemAltinawi/skinning/AutomatedComparison/server/uploadedImages/inputStencils/inputsStencils.json";

export async function convertDataToJSON(data) {
  try {
    const jsonData = JSON.stringify(data, null, 2); // Convert JavaScript object to JSON string
    await fs.writeFileSync(path, jsonData); // Write JSON data to a file named 'data.json'

    console.log("Data converted to JSON and saved to data.json");
  } catch (error) {
    console.error("Error converting data to JSON:", error);
  }
}

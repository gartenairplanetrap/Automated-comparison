import { useState } from "react";
import axios from "axios";

const useFileDownloader = () => {
  const [error, setError] = useState(null);

  const downloadFile = async (filePath, fileName) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/download`,
        {
          filePath,
          fileName,
        },
        {
          responseType: "blob", // Specify response type as blob to handle binary data
        }
      );

      // Create a temporary anchor element to trigger the file download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); // Set the file name for download
      document.body.appendChild(link);
      link.click();

      // Clean up: remove the temporary anchor element
      link.parentNode.removeChild(link);
    } catch (err) {
      setError("Error downloading file");
    }
  };

  return { downloadFile, error };
};

export default useFileDownloader;

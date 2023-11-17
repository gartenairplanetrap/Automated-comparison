import React, { useState } from "react";
import axios from "axios";

const UploadImages = () => {
  const [folder1Zip, setFolder1Zip] = useState(null);
  const [folder2Zip, setFolder2Zip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFolder1ZipChange = (event) => {
    setFolder1Zip(event.target.files[0]);
  };

  const handleFolder2ZipChange = (event) => {
    setFolder2Zip(event.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);
    console.log(folder1Zip);
    const formData = new FormData();
    formData.append("folder1Zip", folder1Zip);
    formData.append("folder2Zip", folder2Zip);

    try {
      // Send the pre-zipped folders to the backend
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/upload-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      setIsLoading(false);
      console.log("Upload complete");
    } catch (error) {
      console.error("Upload error:", error);
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1>Zipped Folder Upload</h1>
      <input type="file" onChange={handleFolder1ZipChange} />
      <input type="file" onChange={handleFolder2ZipChange} />
      <button onClick={handleUpload}>Upload</button>
      {isLoading && <p>Uploading...</p>}
    </div>
  );
};

export default UploadImages;

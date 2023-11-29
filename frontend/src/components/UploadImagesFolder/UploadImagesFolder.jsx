import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UploadImagesFolder.css";
import useFileDownloader from "../../utils/useFileDownload";
import SocketComponent from "../Socketcomponent/SocketComponent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UploadImagesFolder = () => {
  const { downloadFile, error } = useFileDownloader();
  const [folder1Zip, setFolder1Zip] = useState(null);
  const [folder2Zip, setFolder2Zip] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [screenSizeValue, setScreenSizeValue] = useState("");
  const [typeValue, setTypeValue] = useState("");
  const [prlValue, setPrlValue] = useState("");
  const [uploadDisabled, setUploadDisabled] = useState(true);

  // Function to handle change in select inputs
  const handleScreenSizeChange = (e) => {
    setScreenSizeValue(e.target.value);
    checkUploadAvailability();
  };

  const handleTypeChange = (e) => {
    setTypeValue(e.target.value);
    checkUploadAvailability();
  };

  const handlePrlChange = (e) => {
    setPrlValue(e.target.value);
    checkUploadAvailability();
  };

  // Function to check if all options are selected
  const checkUploadAvailability = () => {
    if (screenSizeValue !== "" && typeValue !== "" && prlValue !== "") {
      console.log(uploadDisabled);
      setUploadDisabled(false);
    } else {
      setUploadDisabled(true);
    }
  };

  useEffect(() => {
    checkUploadAvailability();
  }, [typeValue, prlValue, screenSizeValue]);

  const handleFolder1ZipChange = (event) => {
    setFolder1Zip(event.target.files[0]);
  };

  const handleFolder2ZipChange = (event) => {
    setFolder2Zip(event.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true);

    const formData = new FormData();
    formData.append("folder1Zip", folder1Zip);
    formData.append("folder2Zip", folder2Zip);

    formData.append("screenSize", screenSizeValue);
    formData.append("prl", prlValue);
    formData.append("type", typeValue);

    try {
      // Send the pre-zipped folders to the backend
      const response = await axios
        .post(
          `${process.env.REACT_APP_BASE_URL}/api/upload-images`,
          formData,

          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((data) => {
          const filePath = data.data.zippedFolderPath;
          const fileName = data.data.zipFileName;

          downloadFile(filePath, fileName);
        });

      setIsLoading(false);

      toast.success("Comparison Complete", {
        autoClose: 3000,
      });
      console.log("Upload complete");
    } catch (error) {
      console.error("Upload error:", error);
      setIsLoading(false);
    }
  };

  toast.error(error);

  return (
    <div>
      <h1>Zipped Folder Upload</h1>
      <input type="file" onChange={handleFolder1ZipChange} />
      <input type="file" onChange={handleFolder2ZipChange} />

      <div className="upload-container">
        <select
          className="select-box"
          value={screenSizeValue}
          onChange={handleScreenSizeChange}
        >
          <option value="">Select Screen Size</option>
          <option value="10.4">10.4</option>
          <option value="12.9">12.9</option>
          <option value="15">15</option>
        </select>

        <select
          className="select-box"
          value={typeValue}
          onChange={handleTypeChange}
        >
          <option value="">Select Type</option>
          <option value="rhd">RHD</option>
          <option value="lhd">LHD</option>
          <option value="arabic">Arabic</option>
        </select>

        <select
          className="select-box"
          value={prlValue}
          onChange={handlePrlChange}
        >
          <option value="">Select PRL</option>
          <option value="f386">F386</option>
          <option value="f380">F380</option>
          <option value="f61">F61</option>
          <option value="f308">F308</option>
          <option value="f309">F309</option>
          <option value="f390">F390</option>
        </select>
      </div>
      <button
        className={`upload-button ${uploadDisabled ? "disabled" : ""}`}
        onClick={handleUpload}
        disabled={uploadDisabled}
      >
        Upload
      </button>
      {/* {isLoading && <p>Uploading...</p>}
      {error && <div>Error: {error}</div>} */}
      <div>
        <ToastContainer pauseOnFocusLoss={false} />
      </div>
      <SocketComponent />
    </div>
  );
};

export default UploadImagesFolder;

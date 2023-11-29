import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { FaCodeCompare } from "react-icons/fa6";

const ImageComparer = ({ image1Data, image2Data, masks }) => {
  const [comparedImage, setComparedImage] = useState(null);

  const handleCompareImages = async () => {
    if (!image1Data || !image2Data) {
      console.error("Please provide both images and masks");
      toast.Error("Please provide both images");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image1", image1Data);
      formData.append("image2", image2Data);
      formData.append("masks", JSON.stringify(masks));

      const response = await axios.post(
        "http://your-server-url/compare-images",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          responseType: "blob",
        }
      );

      if (response.status === 200) {
        const comparedImageData = response.data;
        setComparedImage(URL.createObjectURL(comparedImageData));
      } else {
        throw new Error("Failed to compare images");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <div className=" icon-container">
        <button
          className="icon"
          style={{ color: "green", marginTop: "2rem" }}
          onClick={handleCompareImages}
        >
          <FaCodeCompare />
        </button>
      </div>
      <button onClick={handleCompareImages}>Compare Images</button>
      {comparedImage && <img src={comparedImage} alt="Compared Image" />}
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
};

export default ImageComparer;

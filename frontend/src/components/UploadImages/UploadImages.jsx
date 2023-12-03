// UploadImages.js
import React, { useContext, useEffect, useState } from "react";
import Stencil from "../Stencil/Stencil";
import { StencilContext } from "../Context/StencilContext/StencilContext";

const UploadImages = () => {
  const { masksContext } = useContext(StencilContext);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);

  const [image1Name, setImage1Name] = useState("");
  const [image2Name, setImage2Name] = useState("");

  const handleImage1Upload = (e) => {
    const uploadedImage = e.target.files[0];
    setImg1(uploadedImage);
    if (uploadedImage) {
      setImage1Name(uploadedImage.name.split(".").slice(0, -1));
    }
    const reader = new FileReader();

    reader.onload = () => {
      setImage1(reader.result);
    };

    if (uploadedImage) {
      reader.readAsDataURL(uploadedImage);
    }
  };

  const handleImage2Upload = (e) => {
    const uploadedImage = e.target.files[0];
    setImg2(uploadedImage);
    if (uploadedImage) {
      setImage2Name(uploadedImage.name.split(".").slice(0, -1));
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImage2(reader.result);
    };

    if (uploadedImage) {
      reader.readAsDataURL(uploadedImage);
    }
  };

  return (
    <div>
      <div className="upload-container">
        <label htmlFor="img1" className="custom-file-input">
          Select Image 1
        </label>
        <input
          className="file-input"
          id="img1"
          type="file"
          onChange={handleImage1Upload}
          accept="image/*"
        />

        <label htmlFor="img2" className="custom-file-input">
          Select Image 2
        </label>
        <input
          className="file-input"
          id="img2"
          type="file"
          onChange={handleImage2Upload}
          accept="image/*"
        />
      </div>
      <div className="image-name">
        <p>{image1Name}</p>
        <p>{image2Name}</p>
      </div>
      {image1 && image2 && (
        <Stencil image1={image1} image2={image2} img1={img1} img2={img2} />
      )}
    </div>
  );
};

export default UploadImages;

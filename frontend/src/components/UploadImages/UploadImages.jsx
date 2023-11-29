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

  const handleImage1Upload = (e) => {
    const uploadedImage = e.target.files[0];
    setImg1(uploadedImage);
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
      <input type="file" onChange={handleImage1Upload} accept="image/*" />
      <input type="file" onChange={handleImage2Upload} accept="image/*" />
      {image1 && image2 && (
        <Stencil image1={image1} image2={image2} img1={img1} img2={img2} />
      )}
    </div>
  );
};

export default UploadImages;

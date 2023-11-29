import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "./Stencil.css"; // Import your CSS file

const Stencil = () => {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState({
    width: 200,
    height: 150,
    top: 50,
    left: 100,
    color: "#000000", // Initial color
  });

  const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (uploadedImage) {
      reader.readAsDataURL(uploadedImage);
    }
  };

  const handleResize = (e, direction, ref, delta, position) => {
    const { offsetWidth: width, offsetHeight: height } = ref;
    const { x, y } = position;

    setMask((prevMask) => ({
      ...prevMask,
      width: parseFloat(width.toFixed(2)),
      height: parseFloat(height.toFixed(2)),
      top: parseFloat(y.toFixed(2)),
      left: parseFloat(x.toFixed(2)),
    }));
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setMask((prevMask) => ({
      ...prevMask,
      color: String(color),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    setMask((prevMask) => ({
      ...prevMask,
      [name]: +parsedValue.toFixed(2),
    }));
  };

  return (
    <div>
      <div>
        {" "}
        <input
          type="number"
          name="width"
          value={mask.width}
          onChange={handleInputChange}
          placeholder="Width"
        />
        <input
          type="number"
          name="height"
          value={mask.height}
          onChange={handleInputChange}
          placeholder="Height"
        />
        <input
          type="number"
          name="top"
          value={mask.top}
          onChange={handleInputChange}
          placeholder="Top"
        />
        <input
          type="number"
          name="left"
          value={mask.left}
          onChange={handleInputChange}
          placeholder="Left"
        />
        <input type="color" value={mask.color} onChange={handleColorChange} />
      </div>
      <input type="file" onChange={handleImageUpload} accept="image/*" />
      {image && (
        <div style={{ position: "relative", display: "inline-block" }}>
          <img
            src={image}
            alt="Uploaded"
            onLoad={() => console.log("Image loaded")}
          />
          <Rnd
            size={{ width: mask.width, height: mask.height }}
            position={{ x: mask.left, y: mask.top }}
            onDragStop={(e, d) => {
              setMask((prevMask) => ({
                ...prevMask,
                top: d.y,
                left: d.x,
              }));
            }}
            onResize={handleResize}
            className="resizable-box"
            bounds="parent"
            style={{ backgroundColor: mask.color }}
          ></Rnd>
        </div>
      )}
    </div>
  );
};

export default Stencil;

// Stencil.js

import React, { useState } from "react";
import { Rnd } from "react-rnd";
import "./Stencil.css"; // Import your CSS file
import MaskSettings from "./MaskSettings"; // Import the MaskSettings component

const Stencil = ({ image1, image2 }) => {
  const initialMaskState = {
    width: 200,
    height: 150,
    top: 50,
    left: 100,
    color: "#000000", // Initial color
  };

  const [masks, setMasks] = useState([initialMaskState]);

  /*   const handleImageUpload = (e) => {
    const uploadedImage = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImage(reader.result);
    };

    if (uploadedImage) {
      reader.readAsDataURL(uploadedImage);
    }
  }; */

  const handleAddBox = () => {
    console.log("mask", masks);
    setMasks((prevArray) => [...prevArray, initialMaskState]);
  };

  const handleBoxChange = (e, index) => {
    const { name, value } = e.target;
    console.log(name, value);
    const parsedValue = isNaN(parseFloat(value)) ? 0 : parseFloat(value);

    const updatedBoxes = masks.map((box, idx) => {
      if (idx === index) {
        return {
          ...box,
          [name]: name === "color" ? value : +parsedValue.toFixed(2),
        };
      }
      return box;
    });

    setMasks(updatedBoxes);
  };
  const handleRemoveBox = (indexToRemove) => {
    console.log(indexToRemove);
    setMasks((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  return (
    <div className="main-container">
      <div>
        <button className="btn-add-stencil" onClick={handleAddBox}>
          Add Stencil
        </button>
      </div>
      {image1 && image2 && (
        <div className="settings-container">
          {masks.map((box, index) => (
            <div key={index} className="stencil-container">
              <div className="settings">
                <MaskSettings
                  mask={box}
                  index={index}
                  handleBoxChange={handleBoxChange}
                  handleRemoveBox={handleRemoveBox}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {image1 && image2 && (
        <div className="image-container">
          <div className="image-box">
            <img
              src={image1}
              alt="Uploaded"
              onLoad={() => console.log("Image loaded")}
            />
            {masks.map((box, index) => (
              <Rnd
                size={{ width: box.width, height: box.height }}
                position={{ x: box.left, y: box.top }}
                onDragStop={(e, d) => {
                  const updatedBoxes = [...masks];
                  updatedBoxes[index] = {
                    ...updatedBoxes[index],
                    top: d.y,
                    left: d.x,
                  };
                  setMasks(updatedBoxes);
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const { offsetWidth: width, offsetHeight: height } = ref;
                  const { x, y } = position;
                  const updatedBoxes = [...masks];
                  updatedBoxes[index] = {
                    ...updatedBoxes[index],
                    width: +width.toFixed(2),
                    height: +height.toFixed(2),
                    top: +y.toFixed(2),
                    left: +x.toFixed(2),
                  };
                  setMasks(updatedBoxes);
                }}
                className="resizable-box"
                bounds="parent"
                style={{ backgroundColor: box.color }}
                key={index}
              ></Rnd>
            ))}
          </div>
          <div className="image-box">
            <img
              src={image2}
              alt="Uploaded"
              onLoad={() => console.log("Image loaded")}
            />
            {masks.map((box, index) => (
              <Rnd
                size={{ width: box.width, height: box.height }}
                position={{ x: box.left, y: box.top }}
                onDragStop={(e, d) => {
                  const updatedBoxes = [...masks];
                  updatedBoxes[index] = {
                    ...updatedBoxes[index],
                    top: d.y,
                    left: d.x,
                  };
                  setMasks(updatedBoxes);
                }}
                onResize={(e, direction, ref, delta, position) => {
                  const { offsetWidth: width, offsetHeight: height } = ref;
                  const { x, y } = position;
                  const updatedBoxes = [...masks];
                  updatedBoxes[index] = {
                    ...updatedBoxes[index],
                    width: +width.toFixed(2),
                    height: +height.toFixed(2),
                    top: +y.toFixed(2),
                    left: +x.toFixed(2),
                  };
                  setMasks(updatedBoxes);
                }}
                className="resizable-box"
                bounds="parent"
                style={{ backgroundColor: box.color }}
                key={index}
              ></Rnd>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Stencil;

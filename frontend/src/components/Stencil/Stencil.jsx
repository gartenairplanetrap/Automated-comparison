// Stencil.js

import React, { useContext, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import "./Stencil.css"; // Import your CSS file
import MaskSettings from "./MaskSettings"; // Import the MaskSettings component
import { IoMdAddCircle } from "react-icons/io";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";
import SaveStencil from "../SaveStencil/SaveStencil";
import StencilsLists from "../StencilsLists/StencilsLists";
import { StencilContext } from "../Context/StencilContext/StencilContext";

import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { FaCodeCompare } from "react-icons/fa6";
import { AiOutlineDownload } from "react-icons/ai";
import { IoMdDownload } from "react-icons/io";
import useSingleComparisonDownload from "../../utils/useSingleComparisonDownload";

const Stencil = ({ image1, image2, img1, img2 }) => {
  const { theme } = useContext(ThemeContext);
  const { setMasksContext } = useContext(StencilContext);
  const [comparedImage, setComparedImage] = useState("");
  const handleClick = useSingleComparisonDownload();
  const initialMaskState = {
    width: 200,
    height: 150,
    top: 50,
    left: 100,
    color: "#000000", // Initial color
  };

  const [masks, setMasks] = useState([initialMaskState]);

  const handleAddBox = () => {
    setMasks((prevArray) => [...prevArray, initialMaskState]);
  };

  const handleBoxChange = (e, index) => {
    const { name, value } = e.target;

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
    setMasks((prevArray) =>
      prevArray.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleCompareImages = async () => {
    if (!img1 || !img2) {
      console.error("Please provide both images and masks");
      toast.Error("Please provide both images");
      return;
    }
    setComparedImage("");
    const formData = new FormData();
    formData.append("image1", img1);
    formData.append("image2", img2);
    formData.append("masks", JSON.stringify(masks));

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/compare-images`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("response", response);

        setComparedImage({
          image: response.data.imageUrl,
          excelFile: response.data.tableData.data,
          imageName: response.data.mismatchResults[0].imageName,
          mismatchPercentage:
            response.data.mismatchResults[0].mismatchPercentage,
        });
      } else {
        throw new Error("Failed to compare images");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    setMasksContext(masks);
  }, [masks]);

  return (
    <div className={`main-container ${theme}`}>
      <div className=" icon-container">
        <button
          className="icon"
          style={{ color: "blue" }}
          onClick={handleAddBox}
        >
          <IoMdAddCircle />
        </button>
        <button className="icon" style={{}} onClick={handleCompareImages}>
          <FaCodeCompare />
        </button>
        {comparedImage && (
          <button
            className="icon"
            style={{ color: "green" }}
            onClick={handleClick(
              comparedImage.image,
              comparedImage.imageName,
              comparedImage.mismatchPercentage
            )}
          >
            <IoMdDownload />
          </button>
        )}
      </div>
      <StencilsLists setStencil={setMasks} />
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
      <SaveStencil stencil={masks} />
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
      <button onClick={handleCompareImages}>Compare Images</button>
      {comparedImage && (
        <div>
          <h2>{comparedImage.mismatchPercentage.toFixed(2)}</h2>
          <img src={comparedImage.image} alt="Compared Image" />
          <button
            onClick={handleClick(
              comparedImage.image,
              comparedImage.imageName,
              comparedImage.mismatchPercentage
            )}
          >
            Download Result
          </button>
        </div>
      )}
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
};

export default Stencil;

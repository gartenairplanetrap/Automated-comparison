import React, { useContext, useEffect, useState } from "react";

import "./StencilsLists.css";
import { StencilContext } from "../Context/StencilContext/StencilContext";
import { ThemeContext } from "../Context/ThemeContext/ThemeContext";

function StencilsLists({ setStencil }) {
  const { theme } = useContext(ThemeContext);
  const { localData } = useContext(StencilContext);
  const [selectedLabel, setSelectedLabel] = useState("");
  const [selectedScreenSize, setSelectedScreenSize] = useState("");
  const [selectedItemName, setSelectedItemName] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrl, setSelectedPrl] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const uniqueLabels = [...new Set(localData.map((item) => item.label))];

  const uniqueScreenSizes = [
    ...new Set(localData.map((item) => item.screenSize)),
  ];

  const uniqueItemNames = [...new Set(localData.map((item) => item.itemName))];

  useEffect(() => {
    const filterData = () => {
      const filteredData = localData.filter(
        (item) =>
          (!selectedLabel || item.label === selectedLabel) &&
          (!selectedScreenSize || item.screenSize === selectedScreenSize) &&
          (!selectedItemName || item.itemName === selectedItemName) &&
          (!selectedType || item.type === selectedType) &&
          (!selectedPrl || item.prl === selectedPrl)
      );

      setFilteredData(filteredData);
    };

    filterData();
  }, [
    localData,
    selectedLabel,
    selectedScreenSize,
    selectedItemName,
    selectedType,
    selectedPrl,
  ]);

  const handleItemClick = (items) => {
    setStencil(items);
  };

  return (
    <>
      <div className={`select ${theme}`}>
        <div className={` ${theme}`}>
          <label>Select Label:</label>
          <select
            value={selectedLabel}
            onChange={(e) => setSelectedLabel(e.target.value)}
          >
            <option value="">-- All Labels --</option>
            {uniqueLabels.map((label) => (
              <option key={label} value={label}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Screen Size:</label>
          <select
            value={selectedScreenSize}
            onChange={(e) => setSelectedScreenSize(e.target.value)}
          >
            <option value="">-- All Screen Sizes --</option>
            {uniqueScreenSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label>Select Type:</label>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">-- All Types --</option>

            <option value="lhd">LHD</option>
            <option value="rhd">RHD</option>
            <option value="arabic">ARABIC</option>
          </select>
        </div>

        <div>
          <label>Select PRL:</label>
          <select
            value={selectedPrl}
            onChange={(e) => setSelectedPrl(e.target.value)}
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
        <div>
          <label>Select Item Name:</label>
          <select
            value={selectedItemName}
            onChange={(e) => setSelectedItemName(e.target.value)}
          >
            <option value="">-- All Item Names --</option>
            {uniqueItemNames.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <ul className="scrollable-list">
        {filteredData.map((item, i) => (
          <li
            className={`stencils-list ${theme}`}
            key={i}
            onClick={() => handleItemClick(item.items)}
          >
            {item.itemName}
          </li>
        ))}
      </ul>
    </>
  );
}

export default StencilsLists;

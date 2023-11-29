// MaskSettings.js

import React from "react";

const MaskSettings = ({ mask, index, handleBoxChange, handleRemoveBox }) => {
  const { width, height, top, left, color } = mask;

  return (
    <div key={index} className="stencil-settings-container">
      <div className="stencil-settings-box">
        <div className="stencil-settings-header">
          <button
            className="delete-stencil-button"
            onClick={() => handleRemoveBox(index)}
          >
            &#x2716; {/* Red X mark */}
          </button>
        </div>
        <div className="input-fields">
          <div className="input-field">
            <label>Width:</label>
            <input
              type="number"
              name="width"
              value={width}
              onChange={(e) => handleBoxChange(e, index)}
              placeholder="Width"
            />
          </div>
          <div className="input-field">
            <label>Height:</label>
            <input
              type="number"
              name="height"
              value={height}
              onChange={(e) => handleBoxChange(e, index)}
              placeholder="Height"
            />
          </div>
          <div className="input-field">
            <label>Top:</label>
            <input
              type="number"
              name="top"
              value={top}
              onChange={(e) => handleBoxChange(e, index)}
              placeholder="Top"
            />
          </div>
          <div className="input-field">
            <label>Left:</label>
            <input
              type="number"
              name="left"
              value={left}
              onChange={(e) => handleBoxChange(e, index)}
              placeholder="Left"
            />
          </div>
          <div>
            <input
              type="color"
              name="color"
              value={color}
              onChange={(e) => handleBoxChange(e, index)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaskSettings;

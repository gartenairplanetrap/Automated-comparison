import React, { useContext, useState } from "react";
import "./SaveStencil.css";
import { StencilContext } from "../Context/StencilContext/StencilContext";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

const SaveStencil = ({ stencil }) => {
  const [label, setLabel] = useState("");
  const [screenSize, setScreenSize] = useState("15");
  const [itemName, setItemName] = useState("");
  const [type, setType] = useState("lhd");
  const [prl, setPrl] = useState("f386");

  const { fetchStencils } = useContext(StencilContext);

  const handleSave = async () => {
    if (!label || !screenSize || !itemName || !prl) {
      toast.error("Please fill in all required fields...");
      return;
    }

    const savedData = {
      label,
      screenSize,
      itemName,
      type,
      prl,
      items: stencil,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/create-stencil`,
        savedData
      );
      toast.success("Stencil saved successfully.", {
        autoClose: 2000,
      });
    } catch (error) {
      console.log(error);
    }
    fetchStencils();
    // Reset the form fields after saving
    setLabel("");
    setItemName("");
  };

  return (
    <div className="save-container">
      <h2>Save Data</h2>
      <div className="save-input-container">
        <label className="input-label">
          Label:
          <input
            className="save-input-field"
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value.trim())}
          />
        </label>

        <label className="input-label">
          Item Name:
          <input
            className="save-input-field"
            type="text"
            value={itemName}
            onChange={(e) => setItemName(e.target.value.trim())}
          />
        </label>

        <label className="input-label">
          Screen Size:
          <select
            className="select-field"
            value={screenSize}
            onChange={(e) => setScreenSize(e.target.value.trim())}
          >
            <option value="15">15</option>
            <option value="12.9">12.9</option>
            <option value="10.4">10.4</option>
          </select>
        </label>
        <label className="input-label">
          Type:
          <select
            className="select-field"
            value={type}
            onChange={(e) => setType(e.target.value.trim())}
          >
            <option value="lhd">LHD</option>
            <option value="rhd">RHD</option>
            <option value="arabic">ARABIC</option>
          </select>
        </label>
        <label className="input-label">
          PRL:
          <select
            className="select-box"
            value={prl}
            onChange={(e) => setPrl(e.target.value.trim())}
          >
            <option value="">Select PRL</option>
            <option value="f386">F386</option>
            <option value="f380">F380</option>
            <option value="f61">F61</option>
            <option value="f308">F308</option>
            <option value="f309">F309</option>
            <option value="f390">F390</option>
          </select>
        </label>
      </div>

      <button className="btn" onClick={handleSave}>
        Save
      </button>
      <ToastContainer pauseOnFocusLoss={false} />
    </div>
  );
};

export default SaveStencil;

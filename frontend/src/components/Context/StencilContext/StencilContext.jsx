import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const StencilContext = createContext();

export const StencilProvider = ({ children }) => {
  const [masksContext, setMasksContext] = useState([]);
  const [localData, setLocalData] = useState(getStencilFromLocalStorage());

  function getStencilFromLocalStorage() {
    const localData = localStorage.getItem("savedStencil");

    if (localData) {
      return JSON.parse(localStorage.getItem("savedStencil"));
    } else {
      return [];
    }
  }

  function setStencilToLocalStorage(stencils) {
    localStorage.setItem("savedStencil", JSON.stringify(stencils));
  }

  const fetchStencils = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/stencils`
      );

      setStencilToLocalStorage(response.data.stencils);
      setLocalData(response.data.stencils);
    } catch (error) {}
  };

  useEffect(() => {
    fetchStencils();
    getStencilFromLocalStorage();
  }, []);

  return (
    <StencilContext.Provider
      value={{ fetchStencils, localData, setMasksContext, masksContext }}
    >
      {children}
    </StencilContext.Provider>
  );
};

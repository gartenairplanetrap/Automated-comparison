import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/variables.css";
import "./styles/theme.css";
import "./styles/styles.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/Context/ThemeContext/ThemeContext";
import { UserContextProvider } from "./components/Context/UserContext/UserContext";
import { StencilProvider } from "./components/Context/StencilContext/StencilContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <ThemeProvider>
      <StencilProvider>
        <UserContextProvider>
          <App />
        </UserContextProvider>
      </StencilProvider>
    </ThemeProvider>
  </BrowserRouter>
);

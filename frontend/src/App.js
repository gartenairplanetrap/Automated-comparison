import { Route, Routes } from "react-router-dom";
import "./App.css";
import UploadImagesFolder from "./components/UploadImagesFolder/UploadImagesFolder";
import Header from "./components/Header/Header";
import Register from "./components/Register/Register";
import ProtectedRoutes from "./components/ProtectedRoute/ProtectedRoutes";
import Login from "./components/Login/Login";
import UploadImages from "./components/UploadImages/UploadImages";
import { ThemeContext } from "./components/Context/ThemeContext/ThemeContext";
import { useContext } from "react";
import { UserContext } from "./components/Context/UserContext/UserContext";

function App() {
  const { user } = useContext(UserContext);
  const { theme } = useContext(ThemeContext);
  return (
    <div className={`App  ${theme} `}>
      <Header />
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/stencil" element={<UploadImages />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<UploadImagesFolder />} path="/" exact />
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import { Router } from "express";

import {
  registerUser,
  loginUser,
  logout,
  getUserData,
} from "../controllers/userControllers.js";
const router = Router();

//http://localhost:5000/user/register
router.post("/register", registerUser);

//http://localhost:5000/user/login
router.post("/login", loginUser);

//http://localhost:5000/user/userData
router.post("/userData", getUserData);

//http:localhost:5000/user/logout
router.get("/logout", logout);

export default router;

import { Router } from "express";
import multer from "multer";
import {
  downloadZippedFolder,
  uploadZippedFolders,
} from "../controllers/imagesController.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploadedImages/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

const router = Router();

router.post(
  "/upload-images",
  upload.fields([
    { name: "folder1Zip", maxCount: 1 },
    { name: "folder2Zip", maxCount: 1 },
  ]),
  uploadZippedFolders
);

router.post("/download", downloadZippedFolder);

export default router;

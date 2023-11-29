import { Router } from "express";
import multer from "multer";
import {
  compareImages,
  createStencils,
  downloadZippedFolder,
  getStencils,
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

const compareStorage = multer.memoryStorage();
const compareUpload = multer({ storage: compareStorage });

const router = Router();

router.post(
  "/upload-images",
  upload.fields([
    { name: "folder1Zip", maxCount: 1 },
    { name: "folder2Zip", maxCount: 1 },
  ]),
  uploadZippedFolders
);

router.post(
  "/compare-images",
  compareUpload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
  ]),
  compareImages
);

router.post("/download", downloadZippedFolder);

router.get("/stencils", getStencils);
router.post("/create-stencil", createStencils);

export default router;

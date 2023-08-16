import multer from "multer";
import path from "path";

const destination = path.resolve("tmp");

const storage = multer.diskStorage({
  destination: destination,
  filename: (req, file, cb) => {
    const { originalname } = file;
    cb(null, originalname);
  },
});

const limits = {
  fileSize: 1024 * 1024 * 2,
};

const upload = multer({
  storage,
  limits,
});

export default upload;

import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
import { GridFSBucket } from "mongodb";
import pkg from "mongodb";

const { ObjectId } = pkg;

dotenv.config();

const storage = new GridFsStorage({ url: process.env.MONGO_URL });
const upload = multer({ storage });

const getFileById = async (fileId) => {
  const db = storage.db;
  const bucket = new GridFSBucket(db);
  const objectId = new ObjectId(fileId);
  const downloadStream = bucket.openDownloadStream(objectId);
  return downloadStream;
};
export { upload, getFileById };

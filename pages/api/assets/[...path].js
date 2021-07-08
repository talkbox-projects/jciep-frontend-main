import { connection, mongo } from "mongoose";
import connectDB from "../../../server/db";

const handler = async (req, res) => {
  const path = req.query.path;
  const filename = path[path.length - 1];
  try {
    const file = await connection.db.collection("assets.files").findOne({
      filename,
    });
    if (!file) {
      throw new Error();
    }
    const bucket = new mongo.GridFSBucket(connection.db, {
      bucketName: "assets",
    });
    res.setHeader("Content-Type", file.contentType);
    res.setHeader("Pragma", "public");
    res.setHeader("Cache-Control", "max-age=31536000");
    res.setHeader("Expires", new Date(Date.now() + 31536000000).toUTCString());

    bucket.openDownloadStream(file._id).pipe(res);
  } catch (error) {
    // console.log(error);
    res.status(404).send("Internal Server Error!");
  }
};

export default connectDB(handler);

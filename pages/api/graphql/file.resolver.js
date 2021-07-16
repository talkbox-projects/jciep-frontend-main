import { GraphQLUpload } from "graphql-upload";
import { connection, mongo } from "mongoose";

export const getMediaBucket = () =>
  new mongo.GridFSBucket(connection.db, {
    bucketName: "assets",
  });

export const createFile = async (stream, { filename, options }) => {
  const bucket = getMediaBucket();
  const uploadStream = bucket.openUploadStream(filename, options);

  const result = await new Promise((resolve, reject) => {
    stream
      .pipe(uploadStream)
      .on("error", (e) => {
        reject();
      })
      .on("finish", () => {
        resolve(uploadStream);
      });
  });
  return result;
};

export const uploadFiles = async (files) => {
  let uploadedFiles = [];

  return new Promise((resolve, reject) => {
    files.map(async (file) => {
      const {
        filename,
        mimetype: contentType,
        createReadStream,
      } = await file.file;

      const result = await createFile(createReadStream(), {
        filename: filename.replace(/\s/g, "_"),
        options: {
          contentType,
          metadata: {
            directory: "/files",
          },
        },
      });

      uploadedFiles.push({
        id: result.id,
        url: `/api/assets${
          result.options.metadata.directory
        }/${result.filename.replace(/\s/g, "_")}`,
        contentType: result.options.contentType,
        fileSize: result.length,
      });

      if (uploadedFiles.length === files.length) {
        resolve(uploadedFiles);
      }
    });
  });
};

export default {
  Upload: GraphQLUpload,
  Query: {},
  Mutation: {
    FileUpload: async (_parent, { files }) => {
      let fileArray = [];

      if (files.length > 0) {
        fileArray = files;
      } else {
        fileArray.push(files);
      }

      return await uploadFiles(fileArray);
    },
  },
};

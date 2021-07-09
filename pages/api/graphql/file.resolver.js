import { GraphQLUpload } from "graphql-upload";
import { connection, mongo } from "mongoose";

export const getMediaBucket = () =>
  new mongo.GridFSBucket(connection.db, {
    bucketName: "files",
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
        filename: filename.replace(" ", "_"),
        options: {
          contentType,
          metadata: {
            directory: "/files",
          },
        },
      });

      uploadedFiles.push({
        id: result.id,
        filename: result.filename.replace(" ", "_"),
        directory: result.options.metadata.directory,
        url: `api/media${
          result.options.metadata.directory
        }/${result.filename.replace(" ", "_")}`,
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
    _FileUpload: async (_parent, { files }) => {
      console.log("testing");
      const f = await Promise.all(files);
      console.log("f", f);
      return [
        {
          id: "file-1",
          contentType: "image/png",
          url: "https://placeholder.com/",
          fileSize: 10000,
        },
      ];
    },
    FileUpload: async (_parent, { files }) => {
      let fileArray = [];

      if (files.length > 1) {
        fileArray = files;
      } else {
        fileArray.push(files);
      }

      return await uploadFiles(fileArray);
    },
  },
};

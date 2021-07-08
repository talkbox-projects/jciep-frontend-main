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

export default {
  Upload: GraphQLUpload,
  Query: {},
  Mutation: {
    FileUpload: async (_parent, { files }) => {
    
      let fileArray = []
      let uploadedFiles = []

      if(files.length > 1) {
        fileArray = files
      } else {
        fileArray .push(files)
      }

      let filesUploaded = new Promise (async (resolve, reject) => {
        for(let i=0; i< fileArray.length; i++) {
          const { filename, mimetype: contentType, createReadStream } = await fileArray[i].file;

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
            url: `api/media${result.options.metadata.directory}/${result.filename.replace(" ", "_")}`,
            contentType: result.options.contentType,
            fileSize: result.length
          })

          if(uploadedFiles.length === fileArray.length) {
            resolve(true)
          }
        }
      })

      await filesUploaded
      return uploadedFiles
    },
  },
};

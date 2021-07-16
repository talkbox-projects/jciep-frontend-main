import { GraphQLUpload } from "graphql-upload";
import { connection, mongo } from "mongoose";

export const getMediaBucket = () =>
  new mongo.GridFSBucket(connection.db, {
    bucketName: "media",
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
  Query: {
    MediaList: async (_parent, { offset = 0, limit = 10, directory = "/" }) => {
      const bucket = getMediaBucket();
      const query = {
        metadata: {
          directory,
        },
      };
      const files = await bucket
        .find(query)
        .skip(offset)
        .limit(limit)
        .toArray();
      if (directory !== "/") directory += "/";
      return {
        count: connection.collection("media.files").countDocuments(query),
        data: files.map((file) => ({
          id: file._id,
          url: `/api/media${directory}${file.filename}`,
          filename: file.filename,
          directory: file.metadata.directory,
          contentType: file.contentType,
        })),
      };
    },
  },
  Mutation: {
    MediaUpload: async (_parent, { file, directory }) => {
      const { filename, mimetype: contentType, createReadStream } = await file;

      const result = await createFile(createReadStream(), {
        filename: filename.replace(/\s/g, "_"),
        options: {
          contentType,
          metadata: {
            directory,
          },
        },
      });

      return {
        filename: result.filename.replace(/\s/g, "_"),
        directory: result.options.metadata.directory,
        contentType: result.options.contentType,
      };
    },

    MediaDelete: async (_parent, { path: _path }) => {
      try {
        const path = _path.split("/").filter((x) => !!x);
        const directory = `/${path.slice(0, path.length - 1).join("/")}`;
        const filename = path[path.length - 1];
        const file = await connection.db.collection("media.files").findOne({
          filename,
          metadata: {
            directory,
          },
        });

        const bucket = getMediaBucket();
        await bucket.delete(file._id);
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    },
  },
};

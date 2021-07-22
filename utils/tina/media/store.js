import { gql } from "graphql-request";
import { getGraphQLClient } from "../../apollo";

export default class MongooseMediaStore {
  static accept = "*";

  async persist(files) {
    try {
      for (const { file, directory } of files) {
        const mutation = gql`
          mutation MediaUpload($file: Upload!, $directory: String!) {
            MediaUpload(file: $file, directory: $directory) {
              filename
              contentType
              directory
            }
          }
        `;

        const variables = {
          file,
          directory,
        };

        const data = await getGraphQLClient().request(mutation, variables);
      }
    } catch (e) {
      console.error(e);
    }
  }
  async list({ directory = directory ?? "/", limit, offset = 0 }) {
    const query = gql`
      query MediaList($directory: String!, $offset: Int!, $limit: Int!) {
        MediaList(directory: $directory, offset: $offset, limit: $limit) {
          data {
            id
            url
            filename
            contentType
            directory
          }
          count
        }
      }
    `;

    const variables = {
      directory,
      offset,
      limit,
    };

    const { MediaList: { data: _items = [], count = _items.length } = {} } =
      await getGraphQLClient().request(query, variables);

    const items = _items?.map(({ id, url, filename, directory }) => {
      return {
        type: "file",
        directory,
        id,
        filename,
        previewSrc: url,
      };
      // type	Indicates whether the object represents a file or a directory.
      // id	A unique identifier for the media item.
      // directory	The path to the file in the store. e.g. public/images
      // filename	The name of the file. e.g.boat.jpg
      // previewSrc	Optional: A url that provides an image preview of the file.
    });

    return { items, limit, offset, totalCount: count };
  }

  async delete({ directory, filename }) {
    try {
      const mutation = gql`
        mutation MediaUpload($path: String!) {
          MediaDelete(path: $path)
        }
      `;

      const variables = {
        path: `${directory === "/" ? directory : directory + "/"}${filename}`,
      };

      await getGraphQLClient().request(mutation, variables);
    } catch (e) {
      console.error(e);
    }
  }
}

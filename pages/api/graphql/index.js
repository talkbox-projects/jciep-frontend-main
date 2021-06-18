import {
  ApolloServer,
  mergeResolvers,
  mergeTypeDefs,
} from "apollo-server-micro";
import connectDB from "../../../server/db";
import shared from "./refs/shared";
import { processRequest } from "graphql-upload";
import mediaResolver from "./media.resolver";
import mediaSchema from "./media.schema";
import pageSchema from "./page.schema";
import pageResolver from "./page.resolver";
import configurationSchema from "./configuration.schema";
import configurationResolver from "./configuration.resolver";
import postSchema from "./post.schema";
import postResolver from "./post.resolver";

const apolloServer = new ApolloServer({
  uploads: false,
  playground: true,
  typeDefs: mergeTypeDefs([
    shared,
    mediaSchema,
    pageSchema,
    postSchema,
    configurationSchema,
  ]),
  resolvers: mergeResolvers([
    mediaResolver,
    pageResolver,
    postResolver,
    configurationResolver,
  ]),
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const apolloHandler = apolloServer.createHandler({ path: "/api/graphql" });

export default connectDB(async (req, res) => {
  const contentType = req.headers["content-type"];
  if (contentType && contentType.startsWith("multipart/form-data")) {
    req.filePayload = await processRequest(req, res);
  }
  return apolloHandler(req, res);
});

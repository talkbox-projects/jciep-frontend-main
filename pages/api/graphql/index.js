import {
  ApolloServer,
  mergeResolvers,
  mergeTypeDefs,
} from "apollo-server-micro";
import connectDB from "../../../server/db";
import configuration from "./configuration.schema";
import post from "./refs/post";
import shared from "./refs/shared";
import user from "./refs/user";
import { processRequest } from "graphql-upload";
import mediaResolver from "./media.resolver";
import mediaSchema from "./media.schema";
import pageSchema from "./page.schema";
import pageResolver from "./page.resolver";
import configurationSchema from "./configuration.schema";
import configurationResolver from "./configuration.resolver";

const apolloServer = new ApolloServer({
  uploads: false,
  typeDefs: mergeTypeDefs([
    shared,
    mediaSchema,
    pageSchema,
    configurationSchema,
  ]),
  resolvers: mergeResolvers([
    mediaResolver,
    pageResolver,
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

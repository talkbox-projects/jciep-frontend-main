import {
  ApolloServer,
  mergeResolvers,
  mergeTypeDefs,
} from "apollo-server-micro";
import connectDB from "../../../server/db";
import { processRequest } from "graphql-upload";
import mediaResolver from "./media.resolver";
import mediaSchema from "./media.schema";
import pageSchema from "./page.schema";
import pageResolver from "./page.resolver";
import configurationSchema from "./configuration.schema";
import configurationResolver from "./configuration.resolver";
import postSchema from "./post.schema";
import postResolver from "./post.resolver";
import sharedSchema from "./shared.schema";
import userSchema from "./user.schema";
import organizationSchema from "./organization.schema";
import userResolver from "./user.resolver";
import organizationResolver from "./organization.resolver";
import nookies from "nookies";
import jwt from "jsonwebtoken";

const apolloServer = new ApolloServer({
  uploads: false,
  introspection: true,
  playground: true,
  typeDefs: mergeTypeDefs([
    sharedSchema,
    mediaSchema,
    pageSchema,
    postSchema,
    configurationSchema,

    organizationSchema,
    userSchema,
  ]),
  resolvers: mergeResolvers([
    mediaResolver,
    pageResolver,
    postResolver,
    configurationResolver,

    organizationResolver,
    userResolver,
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

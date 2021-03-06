import {
  ApolloServer,
  mergeResolvers,
  mergeTypeDefs,
} from "apollo-server-micro";
import connectDB from "../../../server/db";
import { processRequest } from "graphql-upload";
import mediaResolver from "./media.resolver";
import mediaSchema from "./media.schema";
import fileSchema from "./file.schema";
import fileResolver from "./file.resolver";
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
import enumSchema from "./enum.schema";
import enumResolver from "./enum.resolver";
import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();
import { getCurrentUser } from "../../../utils/auth";

const apolloServer = new ApolloServer({
  uploads: false,
  introspection: true,
  playground: publicRuntimeConfig.NODE_ENV === "development",
  typeDefs: mergeTypeDefs([
    /* enum */
    enumSchema,
    sharedSchema,
    mediaSchema,
    fileSchema,
    pageSchema,
    postSchema,
    configurationSchema,
    organizationSchema,
    userSchema,
  ]),
  resolvers: mergeResolvers([
    /* enum */
    enumResolver,
    mediaResolver,
    fileResolver,
    pageResolver,
    postResolver,
    configurationResolver,
    organizationResolver,
    userResolver,
  ]),
  context: async (context) => {
    context.auth = await getCurrentUser(context);
    return context
  }
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

import {
  ApolloServer,
  mergeResolvers,
  mergeTypeDefs,
} from "apollo-server-micro";
import nookies from "nookies";
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
import jwt from "jsonwebtoken";
import { User } from "./user.model";

const apolloServer = new ApolloServer({
  uploads: false,
  introspection: true,
  playground: true,
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
    fileResolver,
    mediaResolver,
    pageResolver,
    postResolver,
    configurationResolver,
    organizationResolver,
    userResolver,
  ]),
  context: async (context) => {
    try {
      const token = nookies.get(context);

      if (token) {
        let user = jwt.decode(token, "shhhhh");
        if (user) {
          user = await User.findById(user._id).populate("identities");
          console.log("user", user);
          return { user, context };
        }
      }
      return { user: null, context };
    } catch (error) {
      console.log(error);
      return { user: null, context };
    }
  },
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

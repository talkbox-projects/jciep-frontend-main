import mongoose from "mongoose";
import getConfig from "next/config";

const connect = async () => {
  const { serverRuntimeConfig } = getConfig();
  await mongoose
    .connect(serverRuntimeConfig.MONGODB_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => console.log(`Mongo running`))
    .catch((err) => console.log("a", err));
};

const connectDB = (handler) => async (req, res) => {
  if (mongoose.connections[0].readyState !== 1) {
    await connect();
  }
  return handler(req, res);
};

const db = mongoose.connection;

db.once("ready", () => console.log(`connected to mongo on `));

db.on("connecting", () => console.log("connecting"));
db.on("connected", () => console.log("connected"));
db.on("open", () => console.log("open"));
db.on("disconnecting", () => console.log("disconnecting"));
db.on("disconnected", () => console.log("disconnected"));
db.on("close", () => console.log("close"));
db.on("reconnected", () => console.log("reconnected"));
db.on("error", () => console.log("error"));
db.on("fullsetup", () => console.log("fullsetup"));
db.on("all", () => console.log("all"));
db.on("reconnectFailed", () => console.log("reconnectFailed"));

export default connectDB;

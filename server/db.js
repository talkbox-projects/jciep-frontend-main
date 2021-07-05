import mongoose from "mongoose";

const connect = async () => {
  await mongoose
    .connect(process.env.MONGODB_URL, {
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

export default connectDB;

import mongoose from "mongoose";

const connect = async () => {
  await mongoose
    .connect(
      "mongodb+srv://timay:cobhPsfBwKFmZuRW@cluster0.czmdg.mongodb.net/hku?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
        useCreateIndex: true,
      }
    )
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

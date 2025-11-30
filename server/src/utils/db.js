import mongoose from "mongoose";

let mem;

const connect = async (uri) => {
  mongoose.set("strictQuery", true);
  if (!uri) {
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      mem = await MongoMemoryServer.create();
      uri = mem.getUri();
    } catch (e) {
      throw new Error(
        "MONGODB_URI missing and 'mongodb-memory-server' not installed. Set MONGODB_URI in server/.env or install mongodb-memory-server."
      );
    }
  }
  await mongoose.connect(uri, { autoIndex: true });
};

export default connect;

import mongoose from "mongoose";

const mongodb = () => {
  let url: string = process.env.MONGO_URL || "";
  mongoose.connect(url);
};

export default mongodb;

import mongoose from "mongoose";

const mongodb= async () => {
  await mongoose.connect(process.env.MONGO_URI)
}

export default mongodb


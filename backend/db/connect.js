import mongoose from "mongoose";

const connectDB = async (url) => {
    mongoose.set("sanitizeFilter", true);
    await mongoose.connect(url);
}

export default connectDB
import mongoose from "mongoose";
import { DB_NAME } from "../utils/constants.js";

const connectDB = async () => {
    try{
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected successfully to host: ${connectionInstance.connection.host}`);


    }
    catch{
        console.log("Error connecting to MongoDB", error);
        process.exit(1);
    }
}


export default connectDB;

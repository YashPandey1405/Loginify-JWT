import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DB_Connect = () => {
  mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => {
      console.log(`Error connecting to mongodb : ${err}`);
    });
};

export default DB_Connect;

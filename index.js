import express from "express";
import dotenv from "dotenv";
import ejsMate from "ejs-mate";
import path from "path";
import { fileURLToPath } from "url";

import DB_Connect from "./utils/DataBase.utils.js";
import Router from "./routes/AuthenticationRoutes.js";
import cookieParser from "cookie-parser";

const app = express();

dotenv.config();

// Define __dirname manually in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set EJS as the view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // Ensure the views directory is set
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", ejsMate);

// Important To Read The JSON & Form data.....
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to The Database....
DB_Connect();

app.use("/", Router);

app.listen(process.env.PORT || 3000, () => {
  console.log("server is running on port ", process.env.PORT);
});

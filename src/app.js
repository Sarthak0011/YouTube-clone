import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }))
app.use(express.json({ limit: "16kb" }))    // Parse incoming json request with limit
app.use(express.urlencoded({ extended: true, limit: "16kb" }))  // Parse incoming request from url with limit
app.use(express.static("public"))   // Serves static files from public directory
app.use(cookieParser())     // Server will be able to perform CRUD operations on client's browser

export { app };
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
    path: "./env"
});

connectDB()
    .then(() => {
        const PORT = process.env.PORT || 8001;
        app.listen(PORT, () => {
            `Server is listening on PORT:${PORT}`
        })
        app.on("error", (error) => {
            console.log("ERROR:", error);
            throw error;
        })
    })
    .catch((error) => {
        console.log(`Connetion to MONGO DB is failed!! `, error);
    })
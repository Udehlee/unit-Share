import express from "express";
import logger  from "./utils/logger.js";
import { connectDB } from "./db/db.conn.js";
import  routes  from "./routes/routes.js"; 
import dotenv from "dotenv"
dotenv.config()

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.get("/", (req, res) => {
  res.status(200).json({
    message: "server is running on port 3000",
    status: "success"
  })
})

app.use("/api/v1", routes);

const startServer = async () => {
  try {
    await connectDB(); 
    app.listen(process.env.PORT, () => {
      logger.info("Server running at http://localhost:" + process.env.PORT);
    });
  } catch (err) {
    logger.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer();




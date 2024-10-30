import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db";
import authRouter from "./routes/authRoutes";
import itemRouter from "./routes/itemRoutes";
import morgan from "morgan";

dotenv.config();
connectDB();

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Server Running");
});
app.use("/api/auth", authRouter);
app.use("/api/items", itemRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);

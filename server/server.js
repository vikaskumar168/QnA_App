import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/user.route.js";
import questionRouter from "./routes/question.route.js";
import commentRouter from "./routes/comment.route.js";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/api/users", userRouter);
app.use("/api/questions", questionRouter);
app.use ("/api/comments", commentRouter);

connectDB();
app.get("/", (req, res) => {
    res.send("Hello World");
    }
);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    }
);


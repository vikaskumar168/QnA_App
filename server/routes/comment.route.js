import express from "express";
import protect from "../middlewares/auth.middleware.js";
import { addComment, deleteComment, getComments } from "../controllers/comment.controller.js";
const commentRouter = express.Router();

commentRouter.route("/addcomment/:id").post(protect, addComment);
commentRouter.route("/getcomments/:id").get(protect, getComments);
commentRouter.route("/deletecomment/:id").delete(protect, deleteComment);

export default commentRouter;

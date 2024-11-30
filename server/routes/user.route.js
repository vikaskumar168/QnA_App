import express from "express";
import { getUserDetails, login, signup } from "../controllers/user.controllers.js";
import protect from "../middlewares/auth.middleware.js";
const userRouter = express.Router();

userRouter.post("/signup", signup);
userRouter.post("/login", login);
userRouter.route("/me").get(protect, getUserDetails);


export default userRouter;
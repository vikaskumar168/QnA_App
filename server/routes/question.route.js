import express from "express";
import {
  approveQuestion,
  deleteQuestion,
  editQuestion,
  getAllQuestions,
  getApprovedQuestions,
  getPendingQuestions,
  getQuestionById,
  getRejectedQuestions,
  postQuestion,
  rejectQuestion,
} from "../controllers/question.controller.js";
import protect from "../middlewares/auth.middleware.js";
const questionRouter = express.Router();

questionRouter.route("/").get( getAllQuestions);
questionRouter.route("/:id").get( getQuestionById);
questionRouter.route("/postquestion").post(protect, postQuestion);
questionRouter.route("/approvequestion/:id").put(protect, approveQuestion);
questionRouter.route("/rejectquestion/:id").put(protect, rejectQuestion);
questionRouter.route("/editquestion/:id").put(protect, editQuestion);
questionRouter.route("/deletequestion/:id").delete(protect, deleteQuestion);
questionRouter.route("/status/pending").get(getPendingQuestions);
questionRouter.route("/status/rejected").get(protect, getRejectedQuestions);
questionRouter.route("/status/approved").get(getApprovedQuestions);

export default questionRouter;

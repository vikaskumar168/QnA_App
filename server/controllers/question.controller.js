import Question from "../modeles/question.model.js";
import AdminActivity from "../modeles/adminActivity.model.js";
import User from "../modeles/user.model.js";
// Post a Question

export async function postQuestion(req, res) {
  try {
    const { title, description, tags } = req.body;

    if (!title || !description || !tags) {
      return res
        .status(400)
        .json({ message: "Please provide title, description and tags" });
    }
    const userId = req.user._id;
 
    const question = new Question({ title, description, tags, author: userId });
    await question.save();
    await User.findByIdAndUpdate(userId, {
      $push: { questions: question._id },
    }).exec();

    res.status(201).json({ message: "Question posted successfully", question });
  } catch (error) {
    res.status(500).json({ message: "Error posting question", error });
  }
}

export async function approveQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const user = req.user._id;

    if (user.role === "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminId = user._id;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { status: "approved" },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    // Log admin activity
    const activity = new AdminActivity({
      admin: adminId,
      action: "approve",
      target: questionId,
      targetType: "question",
    });
    await activity.save();

    res.status(200).json({ message: "Question approved", question });
  } catch (error) {
    res.status(500).json({ message: "Error approving question", error });
  }
}

export async function rejectQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const user = req.user._id;

    if (user.role === "admin") {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const adminId = user._id;

    const question = await Question.findByIdAndUpdate(
      questionId,
      { status: "rejected" },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const activity = new AdminActivity({
      admin: adminId,
      action: "reject",
      target: questionId,
      targetType: "question",
    });
    await activity.save();

    res.status(200).json({ message: "Question rejected", question });
  } catch (error) {
    res.status(500).json({ message: "Error rejecting question", error });
  }
}

// Edit a Question
export async function editQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user._id; // Extracted from JWT
    const { title, description, tags } = req.body;

    // Find the question either by author or if the user is an admin
    const question = await Question.findOneAndUpdate(
      {
        _id: questionId,
        $or: [
          { author: userId }, // Check if the user is the author
          { "author.role": "admin" }, // Check if the user is an admin
        ],
      },
      { title, description, tags },
      { new: true }
    );

    if (!question) {
      return res
        .status(404)
        .json({ message: "Question not found or not authorized" });
    }

    res.status(200).json({ message: "Question updated", question });
  } catch (error) {
    res.status(500).json({ message: "Error updating question", error });
  }
}

// Delete a Question
export async function deleteQuestion(req, res) {
  try {
    const questionId = req.params.id;
    const userId = req.user._id; // Extracted from JWT

    // Find and delete the question by author or if the user is an admin
    const question = await Question.findOneAndDelete({
      _id: questionId,
      $or: [
        { author: userId }, // Check if the user is the author
        { "author.role": "admin" }, // Check if the user is an admin
      ],
    });

    if (!question) {
      return res
        .status(404)
        .json({ message: "Question not found or not authorized" });
    }

    res.status(200).json({ message: "Question deleted", question });
  } catch (error) {
    res.status(500).json({ message: "Error deleting question", error });
  }
}


export async function getAllQuestions(req, res) {
  try {
    const questions = await Question.find().populate("author", "name email");
    res.status(200).json({ message: "All questions retrieved", questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching questions", error });
  }
}

export async function getQuestionById(req, res) {
  try {
    const questionId = req.params.id;
    const question = await Question.findById(questionId).populate("author", "name email");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.status(200).json({ message: "Question retrieved", question });
  } catch (error) {
    res.status(500).json({ message: "Error fetching question", error });
  }
}


export async function getPendingQuestions(req, res) {
  try {
    const questions = await Question.find({ status: "pending" }).populate("author", "name email");
    res.status(200).json({ message: "Pending questions retrieved", questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching pending questions", error });
  }
}

export async function getRejectedQuestions(req, res) {
  try {
    const questions = await Question.find({ status: "rejected" }).populate("author", "name email");
    res.status(200).json({ message: "Rejected questions retrieved", questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rejected questions", error });
  }
}

export async function getApprovedQuestions(req, res) {
  try {
    const questions = await Question.find({ status: "approved" }).populate("author", "name email");
    res.status(200).json({ message: "Approved questions retrieved", questions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching approved questions", error });
  }
}

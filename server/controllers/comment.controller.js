import Comment from "../modeles/comment.model.js";
import Question from "../modeles/question.model.js";
import User from "../modeles/user.model.js";
// Add a Comment
export async function addComment(req, res) {
  try {
    const { text } = req.body;
    const questionId = req.params.id;
    const userId = req.user._id;


    const comment = new Comment({ text, question: questionId, author: userId });
    await comment.save();

    Question.findByIdAndUpdate(questionId, {
      $push: { comments: comment._id },
    }).exec();

    User.findByIdAndUpdate(userId, {
      $push: { comments: comment._id },
    }).exec();

    res.status(201).json({ message: "Comment added successfully", comment });
  } catch (error) {
    res.status(500).json({ message: "Error adding comment", error });
    console.log(error);
  }
}

// Get Comments for a Question
export async function getComments(req, res) {
  try {
    const questionId = req.params.id;

    const comments = await Comment.find({ question: questionId }).populate(
      "author",
      "email"
    );

    res.status(200).json({ message: "Comments retrieved", comments });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving comments", error });
  }
}

export async function deleteComment(req, res) {
  try {
    const commentId = req.params.id;
    const userId = req.user._id; 
    const userRole = req.user.role; 
    // Fetch the comment to verify ownership or admin privilege
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment or an admin
    if (comment.author.toString() !== userId && userRole !== "admin") {
      return res.status(403).json({ message: "Unauthorized to delete this comment" });
    }

    // Remove the comment
    await Comment.findByIdAndDelete(commentId);

    // Remove the comment ID from the associated question and user
    await Question.findByIdAndUpdate(comment.question, {
      $pull: { comments: commentId },
    }).exec();

    await User.findByIdAndUpdate(comment.author, {
      $pull: { comments: commentId },
    }).exec();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting comment", error });
    console.log(error);
  }
}

// models/AdminActivity.js
import mongoose from "mongoose";
const adminActivitySchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: ["approve", "reject", "delete"],
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId, // Could reference Question or Comment
      required: true,
    },
    targetType: {
      type: String,
      enum: ["question", "comment"],
      required: true,
    },
  },
  { timestamps: true }
);

const AdminActivity = mongoose.model("AdminActivity", adminActivitySchema);

export default AdminActivity;

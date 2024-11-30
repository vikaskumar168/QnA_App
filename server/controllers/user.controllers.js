import User from "../modeles/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET;

export async function signup(req, res) {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ email, password: hashedPassword, username });
    await user.save();
    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;


    res.status(201).json({ message: "User created successfully", userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide an email and password" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
}


export async function getUserDetails(req, res) {
  try {
    return res.status(200).json({
      _id: req.user._id,
      username: req.user.username,
      useremail: req.user.email,
      role: req.user.role,
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
}

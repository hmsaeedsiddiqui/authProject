import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";
import User from "../models/User.js";

export const registerUser = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validator.isStrongPassword(password, {
      minLength: 8, minLowercase: 1, minUppercase: 1,
      minNumbers: 1, minSymbols: 1
    })) {
      return res.status(400).json({
        message: "Password must be 8+ chars with uppercase, lowercase, number, special char"
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdmin = (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD);

    const newUser = new User({ fullname, email, password: hashedPassword, isAdmin });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.status(201).json({
      message: "User registered successfully",
      user: { id: newUser._id, fullname: newUser.fullname, email: newUser.email, isAdmin: newUser.isAdmin },
      token,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Admin login
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign({ email, isAdmin: true }, process.env.JWT_SECRET, { expiresIn: "1d" });
      return res.json({ message: "Admin login successful", user: { email, isAdmin: true }, token });
    }

    // Normal user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({ message: "Login successful", user: { id: user._id, fullname: user.fullname, email: user.email, isAdmin: user.isAdmin }, token });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

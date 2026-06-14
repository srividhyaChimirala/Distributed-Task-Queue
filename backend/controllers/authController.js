import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// export const register = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.create({ email, password });
//     res.status(201).json({ message: "User registered" });
//   } catch (error) {
//     res.status(400).json({ error: "Registration failed" });
//   }
// };


export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting to register:", email); // Check your backend terminal
    
    const user = await User.create({ email, password });
    console.log("User created successfully");
    
    res.status(201).json({ message: "User registered" });
  } catch (error) {
    console.error("Registration Error:", error); // This will tell us WHY it failed
    res.status(400).json({ error: error.message }); // Return the actual error message
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // const token = jwt.sign({ userId: user._id }, "YOUR_SECRET_KEY", { expiresIn: "1h" });
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
};
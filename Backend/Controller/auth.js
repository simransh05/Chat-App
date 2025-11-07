const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Message = require("../model/Message");
require("dotenv").config();

async function signup(req, res) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getSearch(req, res) {
  try {
    const { name, currentUser } = req.query;
    console.log(name);

    const users = await User.find({
      $and: [
        { name: { $regex: name, $options: "i" } },  
        { name: { $ne: currentUser } }            
      ]
    }).select("_id name email");

    console.log(users);

    if (users.length === 0) return res.status(404).json({ message: "No users found" });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getAllUsers(req, res) {
  try {
    const { name } = req.query;
    const users = await User.find({ name: { $ne: name } }).select("name email");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function getHistory(req, res) {
  const { user1, user2 } = req.query;
  try {
    const userA = await User.findOne({ name: user1 });
    const userB = await User.findOne({ name: user2 });
    if (!userA || !userB) return res.status(404).json({ message: "User not found" });

    const messages = await Message.find({
      $or: [
        { sender: userA._id, receiver: userB._id },
        { sender: userB._id, receiver: userA._id }
      ]
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (err) {
    console.error("Error fetching chat history:", err);
    res.status(500).json({ message: "Error fetching chat history" });
  }
}

module.exports = { signup, login, getSearch, getAllUsers, getHistory };

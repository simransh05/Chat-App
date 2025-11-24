const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Message = require("../model/Message");
const Contact = require('../model/Contact.js');
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
      ProfilePic: ''
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    // console.error("Signup error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

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
      user: { id: user._id, name: user.name, email: user.email, ProfilePic: user.ProfilePic },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      ], deletedBy: { $ne: user1 }
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name")
      .populate("receiver", "name");

    res.json(messages);
  } catch (err) {
    // console.error("Error fetching chat history:", err);
    res.status(500).json({ message: "Error fetching chat history" });
  }
}

async function postContact(req, res) {
  const { name, email, id } = req.body;

  try {
    if (!name || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const alreadyUser = await Contact.findOne({ email });
    if (alreadyUser) {
      return res.status(200).json({ message: "Contact already exists" });
    }
    const userPresent = await User.findOne({ email });

    const newContact = new Contact({
      name,
      email,
      userId: id,
      inviteSent: false,
      contactId: userPresent ? userPresent._id : null
    });

    await newContact.save();
    if (!userPresent) {
      newContact.contactId = newContact._id;
      await newContact.save();
    }
    res.status(201).json({ message: "Successfully added", contact: newContact });
  } catch (err) {
    // console.error(err.message);
    res.status(500).json({ message: "Server error" });
  }
}

async function getContact(req, res) {
  try {
    const userId = req.params.id;

    const contacts = await Contact.find({ userId }).populate("contactId", "ProfilePic");
    // console.log(contacts)
    const result = contacts.map(c => ({
      userId,
      id: c._id,
      name: c.name,
      email: c.email,
      inviteSent: c.inviteSent,
      createdAt: c.createdAt,
      ProfilePic: c.contactId?.ProfilePic || "",
    }));
    res.json(result);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function getChat(req, res) {
  const userId = req.params.id;
  try {
    const chats = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).populate("sender receiver", "name email ProfilePic");
    const usersSet = new Set();
    chats.forEach(c => {
      if (c.sender._id.toString() !== userId) usersSet.add(JSON.stringify({ id: c.sender._id, name: c.sender.name, email: c.sender.email, ProfilePic: c.sender.ProfilePic }));
      if (c.receiver._id.toString() !== userId) usersSet.add(JSON.stringify({ id: c.receiver._id, name: c.receiver.name, email: c.receiver.email, ProfilePic: c.receiver.ProfilePic }));
    });

    const recentUsers = Array.from(usersSet).map(u => JSON.parse(u));
    // console.log(recentUsers)
    res.json(recentUsers);
  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function postInvite(req, res) {
  const { senderId, email } = req.body;
  try {
    const contact = await Contact.findOneAndUpdate(
      { userId: senderId, email },
      { $set: { inviteSent: true } },
      { new: true }
    );
    return res.status(200).json({ message: "Invite sent", contact });

  } catch (err) {
    // console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

async function uploadFile(req, res) {
  try {
    const { userId } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const url = `/uploads/${req.file.filename}`;

    const updated = await User.findByIdAndUpdate(
      userId,
      { ProfilePic: url },
      { new: true }
    );

    // console.log(updated)

    res.json({
      message: "Profile picture updated",
      ProfilePic: updated.ProfilePic,
    });

  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
}

async function updateName(req, res) {
  try {
    const { userId, name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Name cannot be empty" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { name },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      message: "Name updated successfully",
      user
    });

  } catch (error) {
    // console.log(error);
    res.status(500).json({ message: "Server error" });
  }
};

async function deleteChat(req, res) {
  const { user1, user2 } = req.params;
  console.log(user1,user2);
  try {
    await Message.updateMany(
      {
        $or: [
          { senderId: user1, receiverId: user2 },
          { senderId: user2, receiverId: user1 },
        ]
      },
      { $addToSet: { deletedBy: user1 } }   // prevents duplicate entries
    );

    res.json({ success: true, message: "Chat deleted for you" });
  } catch (error) {
    console.error("Delete for me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

module.exports = { signup, login, getAllUsers, getHistory, postContact, getChat, postInvite, getContact, uploadFile, updateName, deleteChat };

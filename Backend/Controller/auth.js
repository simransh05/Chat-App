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
    // console.log(user1, user2);
    const userA = await User.findById(user1);
    const userB = await User.findById(user2);
    // console.log('user', userA, userB)
    if (!userA || !userB) return res.status(404).json({ message: "User not found" });

    const messages = await Message.find({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ],
      deletedBy: { $nin: [user1] }
    })
      .populate("sender receiver", "name email")
      .sort({ timestamp: 1 });
    // console.log();
    // console.log("user messages", messages);
    res.json(messages);
  } catch (err) {
    // console.error("Error fetching chat history:", err);
    res.status(500).json({ message: "Error fetching chat history" });
  }
}

async function postContact(req, res) {
  const { name, email, id } = req.body;

  try {
    if (!email || !name) {
      return res.status(400).json({ message: "Name & Email are required" });
    }

    // Check duplicate contact for this user
    const duplicate = await Contact.findOne({ userId: id, email });
    if (duplicate) {
      return res.status(200).json({ message: "Contact already exists" });
    }

    // Check if email belongs to a registered user
    const userPresent = await User.findOne({ email });

    let newContact;

    if (userPresent) {
      newContact = new Contact({
        userId: id,
        inviteSent: false,
        contactId: userPresent._id,  
        name: userPresent.name,      
        email: userPresent.email
      });
    } else {
      newContact = new Contact({
        userId: id,
        inviteSent: false,
        contactId: null,
        name,
        email
      });
    }

    await newContact.save();

    res.status(201).json({
      message: "Contact added",
      contact: newContact
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}

async function getContact(req, res) {
  try {
    const userId = req.params.id;

    const contacts = await Contact.find({ userId })
      .populate("contactId", "name email ProfilePic");

    const result = contacts.map(c => ({
      userId,
      id: c._id,
      name: c.contactId?.name || c.name,
      email: c.contactId?.email || c.email,
      ProfilePic: c.contactId?.ProfilePic || null
    }));

    res.json(result);

  } catch (err) {
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

  try {
    await Message.updateMany(
      {
        $or: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 }
        ]
      },
      { $addToSet: { deletedBy: user1 } }
    );
    await Message.deleteMany({
      $or: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 }
      ]
    },
      { deletedBy: { $all: [user1, user2] } }
    )

    res.json({ success: true, message: "Chat deleted for you" });
  } catch (error) {
    console.error("Delete for me error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const { userId, oldPass, newPass } = req.body;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(oldPass, user.password); // plain vs hashed
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect" });
    }
    const hashedPass = await bcrypt.hash(newPass, 10);
    user.password = hashedPass;
    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = { signup, login, getAllUsers, getHistory, postContact, getChat, postInvite, getContact, uploadFile, updateName, deleteChat, resetPassword };

const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require('./model/User')
const authRoutes = require("./Route/auth");
const Message = require("./model/Message");
const cookies = require('cookie-parser')
dotenv.config();
const app = express();

app.use(cors({
  origin: process.env.BASE_URL,
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(cookies())
app.use(express.json());

app.use("/", authRoutes);

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;
const io = new Server(server, {
  cors: {
    origin: process.env.BASE_URL,
    methods: ['GET', 'POST'],
    credentials: true
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (id) => {
    users[id] = socket.id;
  });

  socket.on("send_message", async (data, callback) => {
    const { senderId, receiverId, message } = data;

    try {
      const senderUser = await User.findById(senderId);
      const receiverUser = await User.findById(receiverId);

      if (!senderUser || !receiverUser) return;

      const newMessage = new Message({
        sender: senderUser._id,
        receiver: receiverUser._id,
        content: message,
      });
      await newMessage.save();
      const receiverSocketId = users[receiverId];
      await newMessage.populate([
        { path: "sender", select: "name email" },
        { path: "receiver", select: "name email" }
      ]);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", newMessage);
      }
      callback({ status: "ok" });
    } catch (error) {
      console.error("Error saving message:", error);
    }
  });


  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => console.error("MongoDB connection error:", err));

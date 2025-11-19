const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const User = require('./model/User')
const authRoutes = require("./Route/auth");
const Message = require("./model/Message");

dotenv.config();
const app = express();
app.use("/uploads", express.static("uploads")); // make folder(uploads) public 

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST']
}));
app.use(express.json());

app.use("/", authRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST'],
  },
});

const users = {};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("register", (name) => {
    users[name] = socket.id;
  });

  socket.on("send_message", async (data , callback) => {
    const { receiver, message, sender } = data;

    try {
      const senderUser = await User.findOne({ name: sender });
      const receiverUser = await User.findOne({ name: receiver });

      if (!senderUser || !receiverUser) return;

      const newMessage = new Message({
        sender: senderUser._id,
        receiver: receiverUser._id,
        content: message,
      });
      await newMessage.save();
      const receiverSocketId = users[receiver];
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", { sender, receiver, message });
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

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    server.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

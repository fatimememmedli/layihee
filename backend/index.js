const express = require("express");
const app = express();
const mongoose= require("mongoose");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
require("./src/config/config");
const sharp = require("sharp");
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const port = process.env.PORT || 3000;
const fs = require("fs");
const socket = require('socket.io')
const UserRoutes = require("./src/routes/router");
const MessageRoutes = require("./src/routes/messagesRouter")
app.use(bodyParser.json({ limit: "50mb" }));
const server = require('http').createServer(app);
app.use(cors());
app.use("/", UserRoutes);
app.use("/", MessageRoutes);
//multer-=-=-=-=-==-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
const storage = multer.memoryStorage(); // Bellekte geçici olarak sakla

function fileFilter(req, file, cb) {
  const allowedTypes = ["image/jpeg", "image/png", "video/mp4"];

  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error("Invalid file type");
    error.code = "LIMIT_FILE_TYPES";
    return cb(error, false);
  }

  cb(null, true);
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
});

app.post("/photos", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error("No file uploaded");
    }

    // Sıkıştırma işlemi uygula
    const compressedImageBuffer = await sharp(req.file.buffer)
      .resize({ width: 800 }) // İhtiyaca göre ayarlayabilirsiniz
      .toBuffer();

    // Read the profile picture file
    const profilePictureBase =
      `data:${req.file.mimetype};base64,` + compressedImageBuffer.toString("base64");

    res.send(profilePictureBase);
  } catch (error) {
    console.error(error);

    // Handle specific file upload errors
    if (error.code === "LIMIT_FILE_TYPES") {
      return res
        .status(400)
        .json({ message: "Invalid file type. Allowed types: JPEG, PNG, MP4" });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.use("/backend/src/uploads", express.static("uploads"));

//chat
const io = socket(server,{
  cors:{
    origin:"http://localhost:5173",
    credentials:true,
  }
})
global.onlineUsers = new Map();

// Socket.IO Connection Event
io.on("connection", (socket) => {
  global.chatSocket = socket;

  // Add user to onlineUsers map
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);

    // Send updated online users list to all clients
    io.emit("update-online-users", Array.from(onlineUsers.keys()));
  });

  // Send message to a specific user
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });

  // Disconnect Event
  socket.on("disconnect", () => {
    // Remove user from onlineUsers map
    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);

        // Send updated online users list to all clients
        io.emit("update-online-users", Array.from(onlineUsers.keys()));
        break;
      }
    }
  });
});
server.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

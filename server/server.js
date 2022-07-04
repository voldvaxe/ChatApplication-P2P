const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:8080"],
    methods: ["GET", "POST"],
    transports: ["websocket", "polling"],
    credentials: true,
  },
  allowEIO3: true,
});
const jwt = require("jsonwebtoken");
const User = require("./models/userModel");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:8080"],
    credentials: true,
  })
);
app.use(express.static(path.join(__dirname, "Images")));

app.use("/user", require("./routes/userRouter"));

mongoose.connect("mongodb://localhost:27017", (err) => {
  if (err) throw err;
  console.log("Connected to MongoDB");
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

const verifyJWT = (accesstoken) => {
  try {
    var token = accesstoken;
    var userObj = {};
    token = token.split(" ")[1];
    if (!token) console.log("invalid Authentication 1");
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) console.log("invalid Authentication 2");
      userObj = user;
    });
    if (userObj) return userObj;
  } catch (err) {
    console.log(err.message);
  }
};

const getUsers = async () => {
  let usersInfo = [];

  for (var i = 0; i < users.length; i++) {
    const returnedUser = await User.findById(users[i].userId).select(
      "-password"
    );
    usersInfo.push(returnedUser);
  }
  return usersInfo;
};

io.on("connection", (socket) => {
  console.log("a user connected.");

  socket.on("addUser", (accesstoken) => {
    const user = verifyJWT(accesstoken);
    addUser(user.id, socket.id);
    (async () => {
      io.emit("getUsers", await getUsers());
    })();
  });

  socket.on("sendMessage", ({ accesstoken, receiverId, text }) => {
    const sender = verifyJWT(accesstoken);
    const user = getUser(receiverId);
    io.to(user.socketId).emit("getMessage", {
      senderId: sender.id,
      text,
    });
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected!");
    removeUser(socket.id);
    (async () => {
      io.emit("getUsers", await getUsers());
    })();
  });
});

const PORT = process.env.PORT || 8000;

server.listen(PORT, () => console.log("server listen on port " + PORT));

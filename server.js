require("dotenv").config();
const express = require("express");
const app = express();

var chats = require("./routes/chats");
const mongoose = require("mongoose");
app.use(express.json());
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
const server = require("http").createServer(app);
const io = require("socket.io")(server);
server.listen(3000);
var room;
io.on("connection", (socket) => {
  console.log("connection");
  socket.on("joinroom", (data) => {
    room = data;
    socket.join(data);
  });
  // socket.on("login", ({ name, room }, callback) => {});

  socket.on("message", (data) => {
    console.log(data);

    socket.broadcast.to(room).emit("message", data);
  });
});

db.on("error", (error) => console.error(error));
db.once("open", (error) => console.log("connected to database"));

app.set("view engine", "ejs");
// app.listen(3000);

app.get("/", (req, res) => {
  res.render("startscreen");
});

const homeRouter = require("./routes/home");
app.use("/home", homeRouter);

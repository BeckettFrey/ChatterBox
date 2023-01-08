const express = require("express");
const router = express.Router();
const Chat = require("../models/chat");
//encryption
const bcrypt = require("bcrypt");
// For Json input from form
const fs = require("fs");
var bodyParser = require("body-parser");
const { stringify } = require("querystring");
router.use(bodyParser.urlencoded({ extended: false }));

//logging in.

router.post("/:name/:host", async (req, res) => {
  let sendMsg = false;
  var user = req.params.host;
  try {
    var chatCred = await Chat.find({ name: req.params.name }).exec();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  var chat;
  if (chatCred.length === 0) {
    chat = new Chat({
      name: req.params.name,
    });
    console.log(chat);

    // Add to db (4)
    const newChat = await chat.save();
    // (4)

    console.log(newChat);
    chatCred = newChat;
    res.render("chats", { chatCred, user, sendMsg });
  } else {
    chatCred = chatCred[0];
    res.render("chats", { chatCred, user, sendMsg });
  }
});
router.patch("/:name/:host", async (req, res) => {
  var chatCred;
  var user = "BF";
  try {
    chatCred = await Chat.find({ name: req.params.name });
  } catch (err) {
    res.send(err.message);
  }
  chatCred = chatCred[0];
  chatCred.saved.push(req.body.input);
  try {
    await Chat.updateOne({ name: req.params.name }, chatCred);
  } catch (err) {
    res.send(err.message);
  }
  try {
    chatCred = await Chat.find({ name: req.params.name });
  } catch (err) {
    res.send(err.message);
  }
  chatCred = chatCred[0];
  console.log(chatCred);
  let sendMsg = true;
  res.render("chats", { chatCred, user, sendMsg });
});
module.exports = router;

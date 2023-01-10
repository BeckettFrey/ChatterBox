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
//leave chat

router.get("/:name/:host", async (req, res) => {
  const sendMes = false;
  const msg = "";
  var user = req.params.host;
  try {
    var chatCred = await Chat.find({ name: req.params.name }).exec();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  var chat;
  console.log(chatCred.members);
  if (chatCred.length === 0) {
    chat = new Chat({
      name: req.params.name,
      members: [req.params.host],
    });
    console.log(chat.members);
    // Add to db (4)
    const newChat = await chat.save();
    // (4)
    chatCred = newChat;
    res.render("chats", { chatCred, user, msg, sendMes });
  } else {
    chatCred = chatCred[0];
    console.log(chatCred.members.length);
    if (chatCred.members.length == 0) {
      console.log("emptied");
      chatCred.saved = [];
    }
    let dup = false;
    for (let i = 0; i < chatCred.members.length; i++) {
      if (chatCred.members[i] == req.params.host) {
        dup = true;
      }
    }
    if (!dup) {
      chatCred.members.push(req.params.host);
    }
    res.render("chats", { chatCred, user, msg, sendMes });
  }
});
//logging in.

// router.post("/:name/:host", async (req, res) => {
//   const sendMes = false;
//   const msg = "";
//   let sendMsg = false;
//   var user = req.params.host;
//   try {
//     var chatCred = await Chat.find({ name: req.params.name }).exec();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
//   var chat;
//   if (chatCred.length === 0) {
//     chat = new Chat({
//       name: req.params.name,
//     });
//     console.log(chat);

//     // Add to db (4)
//     const newChat = await chat.save();
//     // (4)
//     chatCred = newChat;
//     res.render("chats", { chatCred, user, msg, sendMsg });
//   } else {
//     chatCred = chatCred[0];
//     res.render("chats", { chatCred, user, msg, sendMes });
//   }
// });
router.post("/:name/:host", async (req, res) => {
  var msg = req.body.input;
  var sendMes = true;
  var chatCred;
  var user = req.params.host;
  if (msg != "") {
    msg = req.params.host + ": " + req.body.input;
    try {
      chatCred = await Chat.find({ name: req.params.name });
    } catch (err) {
      res.send(err.message);
    }
    chatCred = chatCred[0];
    chatCred.saved.push(msg);

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

    res.render("chats", { chatCred, user, msg, sendMes });
  } else {
    sendMes = false;
    res.render("chats", { chatCred, user, msg, sendMes });
  }
});
router.delete("/:name/:host", async (req, res) => {});
module.exports = router;

const express = require("express");
const router = express.Router();
const Account = require("../models/account");
//encryption
const bcrypt = require("bcrypt");
// For Json input from form
const fs = require("fs");
var bodyParser = require("body-parser");
const { stringify } = require("querystring");
router.use(bodyParser.urlencoded({ extended: false }));

router.post("/login", async (req, res) => {
  var chatRmv = "";
  var checkAttendance = false;
  var hashPass = await Account.find({ username: req.body.username }).exec();
  try {
    if (await bcrypt.compare(req.body.password, hashPass[0].password)) {
      let cred = hashPass[0];
      res.render("home", { cred });
    } else {
      res.send(" - Password is incorrect - ");
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting all acounts in db. (ADMIN)
router.get("/all", async (req, res) => {
  try {
    const accounts = await Account.find();
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
//New chat
router.post("/:host/new", getAccount, async (req, res) => {
  res.account = res.account[0];
  let dup = false;
  console.log(res.account.hosting.length);
  if (res.account.hosting.length > 0) {
    console.log(dup);
    for (let i = 0; i < res.account.hosting.length; i++) {
      console.log(res.account.hosting[i]);
      console.log(req.params.host);
      if (res.account.hosting[i] == req.body.chat) {
        dup = true;
      }
    }
    console.log(dup);
  }
  console.log("1");
  if (!dup) {
    res.account.hosting.push(req.body.chat);
  }
  console.log("12");
  var checkAttendance = false;
  var chatRmv = "";
  var cred = res.account;
  console.log(res.account);
  try {
    if (await Account.findByIdAndUpdate(res.account._id, res.account)) {
      res.render("home", { cred });
    }
  } catch (err) {
    console.log(err);
  }
});
//Making account.
router.post("/signup", async (req, res) => {
  // Check for repetition (1)
  var name = req.body.username;
  const check = await Account.find({ username: name }).exec();
  if (check == "") {
    // (1)
    // Check for empty entries (2)
    if (req.body.password != null && req.body.username != null) {
      // (2)
      // Hash and Create model Object (3)
      try {
        var hashedPassword = await bcrypt.hash(req.body.password, 10);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
      const account = new Account({
        username: req.body.username,
        password: hashedPassword,
      });
      // (3)
      try {
        // Add to db (4)
        const newAccount = await account.save();
        // (4)
        res.status(201).json(newAccount);
      } catch (err) {
        res.status(400).json({ message: err.message });
      }
    } else {
      res.status(400).json({ message: "cred empty :(" });
    }
  } else {
    res.status(500).json({ message: "Username already in use" });
  }
});

//Deleting account.
router.delete("/:id", getAccount, async (req, res) => {
  try {
    await res.account.remove();
    res.json({ message: "Account deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/leave/:name/:host", getAccount, async (req, res) => {
  res.account = res.account[0];
  var myArray = res.account.hosting;
  const index = myArray.indexOf(req.params.name);
  console.log(res.account);
  myArray.splice(index, 1);
  console.log(myArray);

  try {
    await Account.findByIdAndUpdate(res.account._id, { hosting: myArray });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
  let cred = res.account;
  res.render("home", { cred });
});
//Middleware function to retrieve account and store in res.account
async function getAccount(req, res, next) {
  let account;
  // Search for account.
  try {
    account = await Account.find({ username: req.params.host }).exec();
    if (account == null) {
      res.status(404).json("cannot find account " + req.body.id);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  // Store account if found.
  res.account = account;
  // Leave function.
  next();
}

const chatsRouter = require("../routes/chats");
router.use("/chats", chatsRouter);
module.exports = router;

const mongoose = require("mongoose");
const chatsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  saved: { type: Array, required: false },
  members: { type: Array, required: true },
});
module.exports = mongoose.model("chats", chatsSchema);

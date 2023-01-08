const mongoose = require("mongoose");
const chatsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  saved: { type: Array, required: false },
});
module.exports = mongoose.model("chats", chatsSchema);

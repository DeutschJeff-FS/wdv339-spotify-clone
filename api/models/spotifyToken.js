const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  expires_in: {
    type: Number,
  },
});

module.exports = mongoose.model("SpotifyToken", tokenSchema);

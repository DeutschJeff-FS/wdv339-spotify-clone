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
  token_type: {
    type: String,
  },
  scope: {
    type: String,
  },
});

module.exports = mongoose.model("SpotifyToken", tokenSchema);

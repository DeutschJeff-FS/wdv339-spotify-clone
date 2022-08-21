const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema({
  accessToken: {
    type: String,
  },
  refreshToken: {
    type: String,
  },
  expiresIn: {
    type: Number,
  },
});

module.exports = mongoose.model("SpotifyToken", tokenSchema);

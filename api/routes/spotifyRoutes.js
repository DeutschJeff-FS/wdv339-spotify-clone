const express = require("express");
const router = express.Router();
require("dotenv").config();
const qs = require("qs");
const randomString = require("randomstring");
const SpotifyWebApi = require("spotify-web-api-node");

const SpotifyToken = require("../models/spotifyToken");

router.get("/token", (req, res, next) => {
  res.send(req.query.authorization_code);
});

router.get("/login", (req, res, next) => {
  const state = randomString.generate(16);
  const scope = "user-read-private user-read-email";
  res.redirect(
    `https://accounts.spotify.com/authorize?` +
      qs.stringify({
        response_type: "code",
        client_id: process.env.CLIENT_ID,
        scope: scope,
        redirect_uri: `http://localhost:3000`,
        state: state,
      })
  );
});

router.post("/auth", (req, res, next) => {
  const code = req.body.code;
  const spotifyApi = new SpotifyWebApi({
    redirectUri: `http://localhost:3000`,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      const token = new SpotifyToken({
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
      try {
        const newToken = token.save();
        res.status(201).json(newToken);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    })
    .catch((error) => {
      console.error(error);
      res.sendStatus(400);
    });
});

module.exports = router;

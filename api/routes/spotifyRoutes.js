const express = require("express");
const spotify = express();
require("dotenv").config();
const qs = require("qs");
const randomString = require("randomstring");
const axios = require("axios");

const SpotifyToken = require("../models/spotifyToken");
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URI;
const authString = `Basic ${new Buffer.from(
  `${clientId}:${clientSecret}`
).toString("base64")}`;
const currentTime = Math.floor(Date.now() / 1000);

const patchToken = async (data) => {
  return await SpotifyToken.findOneAndUpdate({}, data);
};

const status = async (req, res, next) => {
  const token = await SpotifyToken.findOne({});
  const validToken = token != {} && token.expires_in > currentTime;

  if (validToken) {
    req.token = token;
  } else {
    await axios({
      method: "POST",
      url: "https://accounts.spotify.com/api/token",
      data: qs.stringify({
        grant_type: "refresh_token",
        refresh_token: token.refresh_token,
      }),
      headers: {
        Authorization: authString,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log(`Token expired. Getting new token.`);
        const data = response.data;
        const updateToken = {
          access_token: data.body.access_token,
          token_type: data.body.token_type,
          scope: data.body.scope,
          expires_in: currentTime + data.body.expires_in,
        };
        patchToken(updateToken);
        req.token = updateToken;
      })
      .catch((error) => {
        console.error(error);
        res.redirect("http://localhost:3000");
      });
  }
  req.validToken = validToken;
  next();
};

spotify.get("/login", async (req, res, next) => {
  const state = randomString.generate(16);
  const scopes = [
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "user-read-private",
    "streaming",
    "user-library-read",
    "user-top-read",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-follow-read",
  ].join(",");

  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      qs.stringify({
        response_type: "code",
        client_id: clientId,
        scope: scopes,
        redirect_uri: redirectUri,
        state: state,
        show_dialog: true,
      })
  );
});

spotify.get("/auth", async (req, res, next) => {
  let token = await SpotifyToken.findOne({});
  const code = req.query.code || null;
  axios({
    method: "POST",
    url: "https://accounts.spotify.com/api/token",
    data: qs.stringify({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: redirectUri,
    }),
    headers: {
      Authorization: authString,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
    .then((response) => {
      const data = response.data;
      if (response.status === 200) {
        res.redirect(
          "http://localhost:3000/?" +
            qs.stringify({
              access_token: data.code,
            })
        );
        if (token === null) {
          const newToken = new SpotifyToken({
            access_token: data.access_token,
            token_type: data.token_type,
            scope: data.scope,
            refresh_token: data.refresh_token,
            expires_in: currentTime + data.expires_in,
          });
          newToken.save();
        } else {
          const updateToken = {
            access_token: data.access_token,
            token_type: data.token_type,
            scope: data.scope,
            refresh_token: data.refresh_token,
            expires_in: currentTime + data.expires_in,
          };
          patchToken(updateToken);
        }
      } else {
        res.redirect(`/?${qs.stringify({ error: `Invalid Token` })}`);
      }
    })
    .catch((error) => {
      res.send(error);
    });
});

spotify.get("/status", status, async (req, res, next) => {
  const token = await SpotifyToken.findOne({});
  const validToken = req.token != {} && token.expires_in > currentTime;

  res.send(validToken);
});

spotify.get("/me", status, async (req, res, next) => {
  const { access_token, token_type } = req.token;
  await axios({
    method: "GET",
    url: `https://api.spotify/com/v1/me`,
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

spotify.get("/playlists", status, async (req, res, next) => {
  const { access_token, token_type } = req.token;
  await axios({
    method: "GET",
    url: `https://api.spotify/com/v1/playlists`,
    headers: {
      Authorization: `${token_type} ${access_token}`,
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

spotify.get("/search", async (req, res, next) => {
  const { access_token, token_type } = req.token;
  await axios({
    method: "GET",
    url: `https://api.spotify.com/v1/search`,
    params: {
      type: "album,artist,track",
      q: req.query.q,
      limit: 5,
    },
    headers: {
      Authorization: `${token_type} ${access_token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

spotify.get("/me/player", async (req, res, next) => {
  const { access_token, token_type } = req.token;
  await axios({
    method: "PUT",
    url: "https://api.spotify.com/v1/me/player",
    headers: {
      Authorization: `${token_type} ${access_token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

spotify.get("/me/player/currently-playing", async (req, res, next) => {
  const { access_token, token_type } = req.token;
  await axios({
    method: "GET",
    url: `https://api.spotify.com/v1/me/player/currently-playing`,
    headers: {
      Authorization: `${token_type} ${access_token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

https: module.exports = spotify;

const express = require("express");
const app = express();
require("dotenv").config();
const qs = require("qs");
const randomString = require("randomstring");
const SpotifyWebApi = require("spotify-web-api-node");
const axios = require("axios");

const SpotifyToken = require("../models/spotifyToken");

const currentTime = Math.floor(Date.now() / 1000);

const patchToken = async (data) => {
  return await SpotifyToken.findOneAndUpdate({}, data);
};

const status = async (req, res, next) => {
  const token = await SpotifyToken.findOne({});
  const valid = token != {} && token.expires_in > currentTime;
  if (valid) {
    req.token = token;
  } else {
    await axios
      .post({
        url: "https://accounts.spotify.com/api/token",
        data: qs.stringify({
          grant_type: "refresh_token",
          refresh_token: token.refresh_token,
        }),
        headers: {
          Authorization: `Basic ${new Buffer.from(
            `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
          ).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
      .then((response) => {
        const data = response.data;
        console.log(data);
        const updatedToken = {
          access_token: data.body.access_token,
          expires_in: currentTime + data.body.expires_in,
        };
        patchToken(updatedToken);
        req.token = updatedToken;
      })
      .catch((error) => {
        res.redirect("http://localhost:3000");
        console.error(error);
      });
  }
  req.valid = valid;
  next();
};

app.get("/login", (req, res, next) => {
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
        show_dialog: true,
      })
  );
});

app.get("/auth", async (req, res, next) => {
  let token = await SpotifyToken.findOne({});
  const code = req.query.code || null;

  axios
    .post({
      url: "https://accounts.spotify.com/api/token",
      data: qs.stringify({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: "http://localhost:3000",
      }),
      headers: {
        Authorization: `Basic ${new Buffer.from(
          `${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`
        ).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
    .then((response) => {
      const data = response.data;
      console.log(data);
      if (response.status === 200) {
        res.redirect(
          "http://localhost:3000/?" +
            qs.stringify({
              access_token: data.body.access_token,
            })
        );
        if (token === null) {
          const createToken = new SpotifyToken({
            access_token: data.body.access_token,
            expires_in: currentTime + data.body.expires_in,
            refresh_token: data.body.refresh_token,
          });
          createToken.save();
        } else {
          const updatedToken = {
            access_token: data.body.access_token,
            expires_in: currentTime + data.body.expires_in,
            refresh_token: data.body.refresh_token,
          };
          patchToken(updatedToken);
        }
      } else {
        res.redirect(
          `/?${qs.stringify({
            error: `Invalid Token`,
          })}`
        );
      }
    })
    .catch((error) => {
      res.send(error);
    });
  //   const spotifyApi = new SpotifyWebApi({
  //     redirectUri: `http://localhost:3000`,
  //     clientId: process.env.CLIENT_ID,
  //     clientSecret: process.env.CLIENT_SECRET,
  //   });

  //   spotifyApi
  //     .authorizationCodeGrant(code)
  //     .then((data) => {
  //       if (token === null) {
  //         const newToken = new SpotifyToken({
  //           accessToken: data.body.access_token,
  //           refreshToken: data.body.refresh_token,
  //           expiresIn: data.body.expires_in,
  //         });
  //         token = newToken;
  //       } else {
  //         const updateToken = {
  //           accessToken: data.body.access_token,
  //           refreshToken: data.body.refresh_token,
  //           expiresIn: data.body.expires_in,
  //         };
  //         patchToken(updateToken);
  //       }
  //       try {
  //         token.save();
  //         res.status(201).json(token);
  //       } catch (error) {
  //         res.status(400).json({ message: error.message });
  //       }
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //       res.sendStatus(400);
  //     });
});

app.get("/status", status, async (req, res, next) => {
  const token = await SpotifyToken.findOne({});
  const valid = req.token != {} && token.expires_in > currentTime;
  res.send(valid);
});

app.get("/me", status, async (req, res, next) => {
  const { access_token } = req.token;
  await axios
    .get(`https://api.spotify.com/v1/me`, {
      headers: {
        Authorization: `${access_token}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/browse/categories", status, async (req, res, next) => {
  const { access_token } = req.token;
  const offset = Math.floor(Math.random() * (45 - 5 + 1) + 1);
  await axios
    .get("https://api.spotify.com/v1/browse/categories", {
      params: {
        country: "us",
        limit: 5,
        offset: offset,
      },
      headers: {
        Authorization: `${access_token}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.get("/browse/new-releases", status, async (req, res, next) => {
  const { access_token } = req.token;
  const offset = Math.floor(Math.random() * (100 - 10 + 1) + 1);
  await axios
    .get("https://api.spotify.com/v1/browse/new-releases", {
      params: {
        country: "us",
        limit: 10,
        offset: offset,
      },
      headers: {
        Authorization: `${access_token}`,
      },
    })
    .then((response) => {
      res.json(response.data);
    })
    .catch((error) => {
      console.error(error);
    });
});

module.exports = app;

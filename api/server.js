const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;

// declare router(s)

// declare database url

// setup mongoose to mongodb connection

// setup route(s) with base url

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});

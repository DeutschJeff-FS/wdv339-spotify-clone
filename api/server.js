const express = require("express");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const PORT = process.env.PORT || 3000;
// declare database url
const DATABASE_URL = process.env.DATABASE_URL;

// Setup mongoose to MongoDB connection
mongoose.connect(DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log(`Database Connection Established.`));

const spotify = require("./routes/spotifyRoutes");
app.use("/spotify/v1", spotify);

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}.`);
});

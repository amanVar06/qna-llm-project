const express = require("express");

const {
  addNewStream,
  getAllStreams,
  deleteAllStreams,
} = require("../controllers/streamController");

const streamRouter = express.Router();

streamRouter.get("/", getAllStreams);
streamRouter.post("/", addNewStream);
streamRouter.delete("/", deleteAllStreams);

module.exports = streamRouter;

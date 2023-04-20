const express = require("express");
const cors = require("cors");

const streamRouter = require("./routes/streamRouter");
const { getAnswerOfQuery } = require("./controllers/queryController");
const { getTranscribe } = require("./controllers/streamController");

const app = express();

app.use(cors());

app.use(express.json());

app.use("/streams", streamRouter);
app.post("/answer", getAnswerOfQuery);
app.post("/transcribe", getTranscribe);

module.exports = app;

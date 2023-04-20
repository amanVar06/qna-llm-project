const streams = require("../models/stream");
const { transcribe } = require("../loadTranscript");

async function addNewStream(req, res) {
  const text = req.body.text;

  if (!text) {
    return res.status(400).json({
      success: false,
      message: "Missing required property text.",
    });
  }

  const Stream = await streams.create({ text });

  return res.status(201).json({
    success: true,
    data: Stream,
  });
}

async function getAllStreams(req, res) {
  const allStreams = await streams.find({}, { __v: 0, _id: 0 });
  return res.status(200).json({
    success: true,
    results: allStreams.length,
    data: allStreams,
  });
}

async function deleteAllStreams(req, res) {
  await streams.deleteMany({});
  return res.status(200).json({
    success: true,
    message: "All Streams/Documents have been deleted.",
  });
}

// async function getTranscribe(req, res) {
//   const { url } = req.body;
//   console.log(url);
//   await transcribe(url);

//   return res.status(200).json({
//     success: true,
//     message: "Transcription Completed and Stored in database.",
//   });
// }

async function getTranscribe(req, res) {
  const { url } = req.body;
  console.log(url);
  await transcribe(url, req, res);
}

module.exports = {
  addNewStream,
  getAllStreams,
  deleteAllStreams,
  getTranscribe,
};

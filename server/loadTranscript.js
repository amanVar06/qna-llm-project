const youtubedl = require("youtube-dl-exec");
const fs = require("fs");
const path = require("path");
const ffmpeg = require("fluent-ffmpeg");
const axios = require("axios");

const { openai } = require("./services/openAI");

const delay = () => new Promise((res) => setTimeout(() => res(), 1500)); // 2000ms

async function getTranscriptChunksWithApi() {
  const chunkDir = "./audio";

  const chunkFiles = fs
    .readdirSync(chunkDir)
    .filter((file) => file.startsWith("chunk-"));

  // console.log(chunkFiles.length);

  if (Array.isArray(chunkFiles)) {
    for (let i = 0; i < chunkFiles.length - 1; i++) {
      try {
        const response = await openai.createTranscription(
          fs.createReadStream(path.join(__dirname, "audio", chunkFiles[i])), // audio file to read
          "whisper-1", // The model to use for transcription.
          undefined, // The prompt to use for transcription.
          "json", // The format of the transcription.
          1, // Temperature
          "en" // Language
        );

        const apiResponse = await axios.post(
          "http://localhost:8000/streams",
          JSON.stringify({ text: response?.data?.text }),
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        // console.log(apiResponse?.data?.data);
        // console.log();
      } catch (error) {
        console.log("THE ERROR: ", error.message);
      }

      await delay();
    }
  }
}

async function splitIntoChunks(chunkDuration, videoUrl, req, res) {
  const file = "./audio/myaudio.mp3";

  const options = {
    extractAudio: true,
    audioFormat: "mp3",
    audioQuality: 0,
    o: file,
  };
  const output = await youtubedl(videoUrl, options);

  console.log(output);

  ffmpeg(file)
    .outputOptions("-f", "segment", "-segment_time", chunkDuration)
    .output("./audio/chunk-%03d.mp3")
    .on("end", async () => {
      console.log("Finished splitting audio into chunks!");
      fs.unlinkSync(file);
      console.log("Deleted original audio file.");
      await getTranscriptChunksWithApi();
      await getTranscript(req, res);
    })
    .run();
}

async function getTranscript(req, res) {
  console.log("transcription starts");
  const response = await axios.get("http://localhost:8000/streams", {
    headers: {
      "Content-Type": "application/json",
    },
  });

  const data = response?.data?.data;
  let transcript = "";

  for (let i = 0; i < data.length; i++) {
    transcript += data[i]?.text;
  }

  console.log("Transcript length: ", transcript.length);
  try {
    fs.writeFileSync("transcription.txt", transcript);
    console.log("File has been saved.");

    return res.status(200).json({
      success: true,
      message: "Transcription Completed and Stored in database.",
    });
  } catch (err) {
    console.error(err);
  }
}

async function transcribe(videoUrl, req, res) {
  if (fs.existsSync("audio"))
    fs.rmSync("audio", { recursive: true, force: true });
  const response = await axios.delete("http://localhost:8000/streams");
  console.log(response?.data);
  await splitIntoChunks(90, videoUrl, req, res); // 90 seconds per chunk
}

module.exports = { transcribe };

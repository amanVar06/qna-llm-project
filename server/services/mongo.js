const mongoose = require("mongoose");

const MONGO_URL = process.env.DATABASE_URI;
// "mongodb+srv://dbUser:a.ceccHJX_j7PKa@cluster0.mphfrsp.mongodb.net/openai?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection ready!!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function connectMongoDB() {
  await mongoose.connect(MONGO_URL);
}

module.exports = { connectMongoDB };

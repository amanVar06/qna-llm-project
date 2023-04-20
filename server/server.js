require("dotenv").config();

const http = require("http");

const app = require("./app");

const { connectMongoDB } = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

async function startServer() {
  await connectMongoDB();

  server.listen(PORT, () => {
    console.log(`Listening to port ${PORT}...`);
  });
}

startServer();
